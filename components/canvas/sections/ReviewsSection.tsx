"use client";

import { EditableText } from "../EditableText";
import type { ReviewsSectionData, TestimonialItem, ThemeConfig } from "@/lib/builder-types";
import { Plus, Trash2, Star } from "lucide-react";

interface ReviewsSectionProps {
  data: ReviewsSectionData;
  onChange: (newData: ReviewsSectionData) => void;
  theme: ThemeConfig;
}

export function ReviewsSection({ data, onChange, theme }: ReviewsSectionProps) {
  const updateField = <K extends keyof ReviewsSectionData>(
    field: K,
    value: ReviewsSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateReview = <K extends keyof TestimonialItem>(
    id: string,
    field: K,
    val: TestimonialItem[K]
  ) => {
    const updated = data.reviews.map((rev) =>
      rev.id === id ? { ...rev, [field]: val } : rev
    );
    onChange({ ...data, reviews: updated });
  };

  const addReview = () => {
    const newRev: TestimonialItem = {
      id: `rev-${Date.now()}`,
      patientName: "New Patient Review",
      treatment: "Specialist Care",
      rating: 5,
      quote:
        "The doctors and clinical staff were empathetic, attentive, and very professional. Highly recommended clinic.",
      date: "Just now",
    };
    onChange({ ...data, reviews: [...data.reviews, newRev] });
  };

  const removeReview = (id: string) => {
    if (data.reviews.length <= 1) return;
    onChange({
      ...data,
      reviews: data.reviews.filter((rev) => rev.id !== id),
    });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <EditableText
              value={data.eyebrow}
              onChange={(v) => updateField("eyebrow", v)}
              tag="p"
              className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
              style={{ color: theme.primary }}
            />
            <div className="mt-2">
              <EditableText
                value={data.headline}
                onChange={(v) => updateField("headline", v)}
                tag="h2"
                className="font-display text-3xl sm:text-4xl text-[hsl(var(--foreground))]"
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold" style={{ color: theme.primary }}>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <EditableText
                value={data.ratingAverage}
                onChange={(v) => updateField("ratingAverage", v)}
              />
              <span>/ 5.0 (</span>
              <EditableText
                value={data.totalReviews}
                onChange={(v) => updateField("totalReviews", v)}
              />
              <span>Verified Patient Reviews)</span>
            </div>
          </div>
          <div>
            <button
              onClick={addReview}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] cursor-pointer shadow-2xs"
            >
              <Plus size={14} /> Add Review
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {data.reviews.map((rev) => (
            <div
              key={rev.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-xs transition hover:shadow-md"
            >
              <button
                onClick={() => removeReview(rev.id)}
                title="Delete this testimonial"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/.15)] hover:text-[hsl(var(--destructive))] transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <div>
                <div className="flex items-center gap-0.5 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <EditableText
                  value={rev.quote}
                  onChange={(v) => updateReview(rev.id, "quote", v)}
                  tag="p"
                  multiline
                  className="text-xs leading-relaxed text-[hsl(var(--foreground))] italic"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[hsl(var(--border))] flex justify-between items-center text-xs">
                <EditableText
                  value={rev.patientName}
                  onChange={(v) => updateReview(rev.id, "patientName", v)}
                  className="font-semibold text-[hsl(var(--foreground))]"
                />
                <EditableText
                  value={rev.treatment}
                  onChange={(v) => updateReview(rev.id, "treatment", v)}
                  className="text-[hsl(var(--muted-foreground))]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
