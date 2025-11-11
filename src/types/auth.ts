import "better-auth/client";

declare module "better-auth/client" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
      isAdmin?: boolean; // Our custom field
    };
  }
}
