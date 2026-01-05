import { db } from "../db";
import { forms } from "../db/forms.schema";
import { and, eq } from "drizzle-orm";

// TODO not needed, it can use form service for sending form configuration
export class EmbedService {
  async getFormEmbed(publicLink: string) {
    console.log({ publicLink });
    const config = await db.query.forms.findFirst({
      where: and(eq(forms.publicLink, publicLink), eq(forms.isPublished, true)),
      columns: {
        title: true,
        description: true,
        id: true,
        configuration: true,
      },
    });
    console.log({ config });
    return config;
  }
}
