import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_TEMPLATE, getTemplateBySlug } from "@/lib/templates";
import type { Event as DbEvent, Media, Order } from "@/types/database.types";
import type { TemplateConfig } from "@/types/template.types";
import { APP_URL } from "@/lib/constants";
import { InvitePageContent } from "./InvitePageContent.client";

type InvitePageProps = {
  params: { id: string };
};

async function fetchInvite(inviteId: string): Promise<{
  order: Order;
  events: DbEvent[];
  media: Media[];
}> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("invite_id", inviteId)
    .maybeSingle();

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!order) {
    notFound();
  }

  const expiresAt = order.expires_at ? new Date(order.expires_at) : null;
  if (
    expiresAt &&
    Number.isFinite(expiresAt.getTime()) &&
    expiresAt.getTime() < Date.now()
  ) {
    notFound();
  }

  const [
    { data: events, error: eventsError },
    { data: media, error: mediaError },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("order_id", order.id)
      .order("event_date", { ascending: true }),
    supabase.from("media").select("*").eq("order_id", order.id),
  ]);

  if (eventsError) throw new Error(eventsError.message);
  if (mediaError) throw new Error(mediaError.message);

  return { order, events: events ?? [], media: media ?? [] };
}

export async function generateMetadata({
  params,
}: InvitePageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const { order } = await fetchInvite(id);
    const title = `${order.couple_name_1} & ${order.couple_name_2} — Wedding Invitation`;
    const description = `You're invited to the wedding of ${order.couple_name_1} & ${order.couple_name_2} on ${order.wedding_date}. View events, gallery, and RSVP.`;
    const canonical = new URL(`/invite/${order.invite_id}`, APP_URL).toString();

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonical,
        siteName: "WedInviter",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: false,
      },
    };
  } catch {
    const canonical = new URL(`/invite/${id}`, APP_URL).toString();
    return {
      title: "Wedding Invitation",
      alternates: { canonical },
      robots: { index: false },
    };
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = params;
  const { order, events, media } = await fetchInvite(id);
  const template = getTemplateBySlug(order.template_slug) ?? DEFAULT_TEMPLATE;

  return (
    <InvitePageContent
      order={order}
      events={events}
      media={media}
      template={template}
    />
  );
}
