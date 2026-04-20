export interface Member {
  id?: number;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  poste: string;
  email: string;
  facebook?: string;
}

export interface Partenaire {
  id?: number;
  nom: string;
  adresse: string;
  email: string;
  telephone: string;
  motifsAttentes: string;
  dateAdhesion: Date;
  statut: 'en_attente' | 'valide' | 'rejete';
}

export interface Actualite {
  id?: number;
  titre: string;
  description: string;
  photo?: string;
  date: Date;
  commentaires: Commentaire[];
  reactions?: Reaction[];
}

export interface Commentaire {
  id?: number;
  actualiteId: number;
  contenu: string;
  date: Date;
  estReponseAdmin: boolean;
  reponseAdmin?: string;
  reponseAdminDate?: Date;
}

export interface Reaction {
  id?: number;
  actualiteId: number;
  fingerprint: string;
  type: 'like' | 'love' | 'support';
  date: Date;
}

export interface Event {
  id?: number;
  titre: string;
  description: string;
  date: Date;
  lieu: string;
  couleur?: string;
}

export interface PartenaireExterne {
  id?: number;
  nom: string;
  logo: string;
  siteWeb: string;
  description: string;
}

export interface Photo {
  id?: number;
  titre: string;
  url: string;
  description?: string;
  date: Date;
  categorie?: string;
}