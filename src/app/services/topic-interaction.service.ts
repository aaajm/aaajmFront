import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface TopicComment {
  id: string;
  topicId: string;
  fingerprint: string;
  content: string;
  createdAt: string;
  adminReply?: string;
  adminReplyAt?: string;
}

export interface ReactionSummary {
  topicId: string;
  counts: Record<string, number>;
  currentReaction?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TopicInteractionService {
  private http = inject(HttpClient);
  private baseUrl = import.meta.env.NG_APP_API_URL || 'http://localhost:8080';

  getComments(topicId: string): Observable<TopicComment[]> {
    return this.http.get<TopicComment[]>(`${this.baseUrl}/topics/${topicId}/comments`);
  }

  addComment(topicId: string, fingerprint: string, content: string): Observable<TopicComment> {
    return this.http.post<TopicComment>(`${this.baseUrl}/topics/${topicId}/comments`, {
      fingerprint,
      content,
    });
  }

  updateComment(commentId: string, fingerprint: string, content: string): Observable<TopicComment> {
    return this.http.put<TopicComment>(`${this.baseUrl}/topics/comments/${commentId}`, {
      fingerprint,
      content,
    });
  }

  replyToComment(commentId: string, reply: string): Observable<TopicComment> {
    return this.http.put<TopicComment>(`${this.baseUrl}/topics/comments/${commentId}/reply`, {
      reply,
    });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/topics/comments/${commentId}`);
  }

  getReactions(topicId: string, fingerprint?: string): Observable<ReactionSummary> {
    const url = fingerprint
      ? `${this.baseUrl}/topics/${topicId}/reactions?fingerprint=${encodeURIComponent(fingerprint)}`
      : `${this.baseUrl}/topics/${topicId}/reactions`;
    return this.http.get<ReactionSummary>(url);
  }

  reactToTopic(topicId: string, fingerprint: string, type: string): Observable<ReactionSummary> {
    return this.http.post<ReactionSummary>(`${this.baseUrl}/topics/${topicId}/reactions`, {
      fingerprint,
      type,
    });
  }
}
