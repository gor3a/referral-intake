import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc/server";
import { db } from "@/server/db";
import { referrals } from "@/server/db/schema";
import { referralSchema } from "@/lib/validations/referral";
import { desc, eq, ilike, or, and } from "drizzle-orm";

export const referralRouter = router({
  submit: publicProcedure
    .input(referralSchema)
    .mutation(async ({ input }) => {
      const [created] = await db.insert(referrals).values(input).returning({ id: referrals.id });
      return {
        id: created.id,
        message: "Referral submitted successfully.",
        followUpNote: "Our team will contact the patient within 24 hours.",
      };
    }),

  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["new", "contacted", "scheduled", "cancelled"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input?.search) {
        conditions.push(
          or(
            ilike(referrals.lawFirmName, `%${input.search}%`),
            ilike(referrals.patientFirstName, `%${input.search}%`),
            ilike(referrals.patientLastName, `%${input.search}%`),
          )
        );
      }
      if (input?.status) {
        conditions.push(eq(referrals.status, input.status));
      }

      return db
        .select()
        .from(referrals)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(referrals.createdAt));
    }),

  updateStatus: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(["new", "contacted", "scheduled", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(referrals)
        .set({ status: input.status })
        .where(eq(referrals.id, input.id))
        .returning({ status: referrals.status });
      return { status: updated.status };
    }),
});
