export interface RequestCreateSupplier {
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  instagramUrl?: string;
  websiteUrl?: string;
}

export interface ResponseSupplier {
  id: string;
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  instagramUrl?: string;
  websiteUrl?: string;
}


