import {AuthProvider} from '@/app/providers';
import {FingerprintService, ReactionSummary, TopicComment, TopicInteractionService} from '@/app/services';
import {ToastService} from '@/app/utils';
import {formatDatetime} from '@/app/utils/date';
import {FileInfo, FileService, Topic as TopicData, TopicService} from '@aaajm/client';
import {CommonModule} from '@angular/common';
import {Component, computed, ElementRef, EventEmitter, HostListener, inject, Input, OnChanges, Output, signal, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {EditorModule} from 'primeng/editor';
import {InputTextModule} from 'primeng/inputtext';
import {SkeletonModule} from 'primeng/skeleton';
import {TextareaModule} from 'primeng/textarea';

const DEFAULT_TRUNCATION_LENGTH = 400;

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");

const stripHtml = (html: string) =>
  decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const formatTopicHtml = (html: string) =>
  html
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/<h[1-6](\s[^>]*)?>/gi, '<p>')
    .replace(/<\/h[1-6]>/gi, '</p>')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sclass="[^"]*"/gi, '');

const truncateAtWord = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  const slice = text.slice(0, maxLength);
  const lastBreak = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('\n'));
  const cut = lastBreak > maxLength * 0.5 ? slice.slice(0, lastBreak) : slice;
  return cut.trimEnd() + '…';
};

export const truncateText = (
  html: string,
  maxLength = DEFAULT_TRUNCATION_LENGTH
) => {
  const plain = stripHtml(html);
  return {
    html: formatTopicHtml(html),
    truncated: truncateAtWord(plain, maxLength),
    overflows: plain.length > maxLength,
  };
};

@Component({
  selector: 'topic',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    SkeletonModule,
    DividerModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './topic.html',
  styles: `
    .topic-body {
      font-size: 15px;
      line-height: 1.3333;
      color: #050505;
      font-weight: 400;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      word-break: normal;
    }
    .topic-body :where(p, ul, ol, h1, h2, h3, h4, h5, h6) {
      margin: 0 0 12px;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      white-space: pre-wrap;
    }
    .topic-body :where(p, ul, ol, h1, h2, h3, h4, h5, h6):last-child {
      margin-bottom: 0;
    }
    .topic-body img {
      max-width: 100%;
      height: auto;
    }
    .topic-more {
      display: inline;
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 15px;
      line-height: 1.3333;
      font-weight: 600;
      color: #65676b;
    }
    .topic-more:hover {
      text-decoration: underline;
    }
    .topic-expanded .topic-body > *:last-child {
      display: inline;
    }
    .topic-expanded > .topic-more {
      margin-left: 0.25em;
    }
  `,
})
export class Topic implements OnChanges {
  @Input({required: true}) topic!: TopicData | null;
  @Output() deleted = new EventEmitter<string>();

  fingerprintService = inject(FingerprintService);
  interactionService = inject(TopicInteractionService);
  authProvider = inject(AuthProvider);
  private topicService = inject(TopicService);
  private fileService = inject(FileService);
  private toast = inject(ToastService);

  @ViewChild('photoStrip') photoStrip?: ElementRef<HTMLDivElement>;
  viewerVisible = signal(false);
  viewerIndex = signal(0);
  topicMenuOpen = signal(false);

  formatDate = formatDatetime;
  editorLoaded = signal(true);

  collapsed = signal(true);
  toggleCollapsed = () => this.collapsed.set(!this.collapsed());

  showProfileZoom = signal(false);

  fingerprint = signal<string>('');
  reactions = signal<ReactionSummary | null>(null);
  comments = signal<TopicComment[]>([]);

  showReactionPopup = signal(false);
  pressTimeout: any;

  startPress() {
    this.pressTimeout = setTimeout(() => {
      this.showReactionPopup.set(true);
    }, 500);
  }

  endPress() {
    if (this.pressTimeout) clearTimeout(this.pressTimeout);
  }

  hidePopup() {
    this.showReactionPopup.set(false);
  }

  topicImages(): FileInfo[] {
    return (this.topic?.images || []).map((img) => this.asFile(img));
  }

  openGallery(index: number) {
    this.viewerIndex.set(index);
    this.viewerVisible.set(true);
    document.body.style.overflow = 'hidden';
    this.topicMenuOpen.set(false);
    setTimeout(() => this.scrollToIndex(index, 'instant'), 0);
  }

  closeViewer() {
    this.viewerVisible.set(false);
    document.body.style.overflow = '';
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
    const el = this.photoStrip?.nativeElement;
    if (!el) return;
    const max = Math.max(this.topicImages().length - 1, 0);
    const next = Math.min(Math.max(index, 0), max);
    this.viewerIndex.set(next);
    el.scrollTo({left: el.clientWidth * next, behavior});
  }

  nextImage(event?: Event) {
    event?.stopPropagation();
    this.scrollToIndex(this.viewerIndex() + 1);
  }

  prevImage(event?: Event) {
    event?.stopPropagation();
    this.scrollToIndex(this.viewerIndex() - 1);
  }

  onStripScroll(event: Event) {
    const el = event.target as HTMLDivElement;
    if (!el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    this.viewerIndex.set(i);
  }

  onStripWheel(event: WheelEvent) {
    const el = this.photoStrip?.nativeElement;
    if (!el || this.topicImages().length <= 1) return;
    event.preventDefault();
    event.stopPropagation();
    el.scrollBy({left: event.deltaY !== 0 ? event.deltaY : event.deltaX, behavior: 'auto'});
  }

  deleteTopic() {
    if (!this.topic?.id || !this.authProvider.isAdmin()) return;
    if (!confirm('Voulez-vous vraiment supprimer ce contenu ?')) {
      return;
    }
    const deleteImage = confirm(
      'Supprimer aussi les photos associées (galerie incluse) ?'
    );
    this.topicService.deleteTopic(this.topic.id, deleteImage).subscribe({
      next: () => {
        this.toast.message(
          'success',
          'Succès',
          deleteImage ? 'Contenu et photos supprimés' : 'Contenu supprimé'
        );
        this.deleted.emit(this.topic!.id);
      },
      error: (err) => console.error('Failed to delete topic', err),
    });
  }

  deleteCurrentPhoto() {
    const img = this.topicImages()[this.viewerIndex()];
    if (!img?.id || !this.authProvider.isAdmin()) return;
    if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return;
    this.fileService.deleteFile(img.id).subscribe({
      next: () => {
        if (this.topic) {
          this.topic.images = (this.topic.images || []).filter(
            (image: any) => image.id !== img.id
          );
        }
        if (this.topicImages().length === 0) {
          this.closeViewer();
        } else {
          this.scrollToIndex(
            Math.min(this.viewerIndex(), this.topicImages().length - 1),
            'instant'
          );
        }
        this.toast.message('success', 'Succès', 'Photo supprimée');
      },
      error: (err) => console.error('Failed to delete photo', err),
    });
  }

  // --- Comment Reactions State (UI Only since no backend API yet) ---
  commentReactions = signal<Record<string, string>>({});
  activeCommentReactionId = signal<string | null>(null);
  commentPressTimeout: any;

  startCommentReactionPress(commentId: string) {
    this.commentPressTimeout = setTimeout(() => {
      this.activeCommentReactionId.set(commentId);
    }, 500);
  }

  endCommentReactionPress() {
    if (this.commentPressTimeout) clearTimeout(this.commentPressTimeout);
  }

  getCommentCurrentReaction(commentId: string): string | undefined {
    return this.commentReactions()[commentId];
  }

  reactToComment(commentId: string, type: string) {
    this.activeCommentReactionId.set(null);
    if (this.commentPressTimeout) clearTimeout(this.commentPressTimeout);
    
    if (type) {
      this.commentReactions.update(map => ({...map, [commentId]: type}));
    } else {
      this.commentReactions.update(map => {
        const newMap = {...map};
        delete newMap[commentId];
        return newMap;
      });
    }
    // Persist to localStorage
    if (this.topic?.id && this.fingerprint()) {
      localStorage.setItem(`comment_reactions_${this.topic.id}_${this.fingerprint()}`, JSON.stringify(this.commentReactions()));
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.activeCommentMenuId() !== null) {
      this.activeCommentMenuId.set(null);
    }
    if (this.activeCommentReactionId() !== null) {
      this.activeCommentReactionId.set(null);
    }
    if (this.topicMenuOpen()) {
      this.topicMenuOpen.set(false);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onViewerKey(event: KeyboardEvent) {
    if (!this.viewerVisible()) return;
    if (event.key === 'Escape') this.closeViewer();
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
  }

  get currentReactionIcon(): string {
    const r = this.reactions()?.currentReaction;
    if (r === 'LOVE') return '❤️';
    if (r === 'SUPPORT') return '🤝';
    if (r === 'LIKE') return '👍';
    return '';
  }

  get currentReactionText(): string {
    const r = this.reactions()?.currentReaction;
    if (r === 'LOVE') return 'J\'adore';
    if (r === 'SUPPORT') return 'Soutien';
    return 'J\'aime';
  }

  get currentReactionColor(): string {
    const r = this.reactions()?.currentReaction;
    if (r === 'LOVE') return 'text-red-600';
    if (r === 'SUPPORT') return 'text-amber-600';
    if (r === 'LIKE') return 'text-blue-600';
    return 'text-gray-600';
  }

  newCommentText = signal<string>('');
  replyTexts = signal<Record<string, string>>({});
  activeReplyId = signal<string | null>(null);

  isSubmittingComment = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic'] && this.topic?.id) {
      this.initInteractions(this.topic.id);
    }
  }

  async initInteractions(topicId: string) {
    try {
      const fp = await this.fingerprintService.getFingerprint();
      this.fingerprint.set(fp);

      // Load persisted comment reactions from localStorage
      const stored = localStorage.getItem(`comment_reactions_${topicId}_${fp}`);
      if (stored) {
        try { this.commentReactions.set(JSON.parse(stored)); } catch {}
      }

      this.interactionService.getReactions(topicId, fp).subscribe({
        next: (res) => this.reactions.set(res),
        error: (err) => console.error('Failed to load reactions', err),
      });

      this.interactionService.getComments(topicId).subscribe({
        next: (res) => this.comments.set(res),
        error: (err) => console.error('Failed to load comments', err),
      });
    } catch (e) {
      console.error('Failed to initialize fingerprint or interactions', e);
    }
  }

  async react(type: string) {
    this.showReactionPopup.set(false);
    if (this.pressTimeout) clearTimeout(this.pressTimeout);
    
    if (!this.topic?.id || !this.fingerprint()) return;
    this.interactionService
      .reactToTopic(this.topic.id, this.fingerprint(), type)
      .subscribe({
        next: (res) => this.reactions.set(res),
        error: (err) => console.error('Failed to react', err),
      });
  }

  async postComment() {
    const text = this.newCommentText().trim();
    if (!text || !this.topic?.id || !this.fingerprint() || this.isSubmittingComment()) return;

    this.isSubmittingComment.set(true);
    this.interactionService
      .addComment(this.topic.id, this.fingerprint(), text)
      .subscribe({
        next: (comment) => {
          this.comments.update((list) => [comment, ...list]);
          this.newCommentText.set('');
          this.isSubmittingComment.set(false);
        },
        error: (err) => {
          console.error('Failed to post comment', err);
          this.isSubmittingComment.set(false);
        },
      });
  }

  toggleReplyBox(commentId: string) {
    this.activeReplyId.set(this.activeReplyId() === commentId ? null : commentId);
  }

  updateReplyText(commentId: string, text: string) {
    this.replyTexts.update((map) => ({...map, [commentId]: text}));
  }

  async sendReply(commentId: string) {
    const replyText = (this.replyTexts()[commentId] || '').trim();
    if (!replyText) return;

    this.interactionService.replyToComment(commentId, replyText).subscribe({
      next: (updatedComment) => {
        this.comments.update((list) =>
          list.map((c) => (c.id === commentId ? updatedComment : c))
        );
        this.activeReplyId.set(null);
        this.updateReplyText(commentId, '');
      },
      error: (err) => console.error('Failed to reply to comment', err),
    });
  }

  activeCommentMenuId = signal<string | null>(null);
  editingCommentId = signal<string | null>(null);
  editCommentText = signal<string>('');

  startEditComment(comment: TopicComment) {
    this.editingCommentId.set(comment.id);
    this.editCommentText.set(comment.content);
  }

  cancelEditComment() {
    this.editingCommentId.set(null);
    this.editCommentText.set('');
  }

  saveEditComment(commentId: string) {
    const text = this.editCommentText().trim();
    if (!text || text === this.comments().find(c => c.id === commentId)?.content) {
      this.cancelEditComment();
      return;
    }
    this.interactionService.updateComment(commentId, this.fingerprint(), text).subscribe({
      next: (updatedComment) => {
        this.comments.update(list => list.map(c => c.id === commentId ? updatedComment : c));
        this.cancelEditComment();
      },
      error: (err) => console.error('Failed to update comment', err)
    });
  }

  deleteComment(commentId: string) {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      this.interactionService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments.update(list => list.filter(c => c.id !== commentId));
        },
        error: (err) => console.error('Failed to delete comment', err)
      });
    }
  }

  shareTopic() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Post de l\'AAAJM',
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Lien copié dans le presse-papiers !');
      });
    }
  }

  asFile(val: any): FileInfo {
    return val;
  }

  textState = computed(() =>
    truncateText(this.topic?.description || '', DEFAULT_TRUNCATION_LENGTH)
  );

  handleInit() {
    this.editorLoaded.set(true);
  }
}
