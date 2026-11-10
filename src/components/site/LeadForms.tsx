import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  franchiseSchema,
  INVESTMENT_OPTIONS,
  PROGRAM_OPTIONS,
  schoolSchema,
  TIME_SLOTS,
  trialSchema,
} from "@/lib/schemas";
import { FormField, selectClass } from "./FormField";

function Success({ title, text, onReset }: { title: string; text: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-mint/10 p-8 text-center">
      <CheckCircle2 className="size-12 text-mint" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="max-w-sm text-muted-foreground">{text}</p>
      <Button variant="outline" onClick={onReset}>
        Submit another
      </Button>
    </div>
  );
}

const friendly = (msg: string) => (msg.includes("row-level") ? "We couldn't save that. Please check the details and try again." : msg);

export function ContactForm({ source = "contact" }: { source?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema) });
  const { register, handleSubmit, formState, reset } = form;
  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.from("enquiries").insert({ ...values, source });
    if (error) return void toast.error(friendly(error.message));
    toast.success("Message sent! We'll get back within one working day.");
    reset();
    setDone(true);
  });
  if (done) return <Success title="Thanks for reaching out!" text="Our team will contact you within one working day." onReset={() => setDone(false)} />;
  const e = formState.errors;
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <FormField label="Name" error={e.name?.message} htmlFor="c-name"><Input id="c-name" autoComplete="name" {...register("name")} /></FormField>
      <FormField label="Email" error={e.email?.message} htmlFor="c-email"><Input id="c-email" type="email" autoComplete="email" {...register("email")} /></FormField>
      <FormField label="Phone" error={e.phone?.message} htmlFor="c-phone"><Input id="c-phone" type="tel" autoComplete="tel" {...register("phone")} /></FormField>
      <FormField label="Subject" error={e.subject?.message} htmlFor="c-subject"><Input id="c-subject" {...register("subject")} /></FormField>
      <FormField label="Message" error={e.message?.message} className="sm:col-span-2" htmlFor="c-message"><Textarea id="c-message" rows={5} {...register("message")} /></FormField>
      <Button type="submit" variant="brand" size="lg" className="sm:col-span-2" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Loader2 className="animate-spin" />} Send message
      </Button>
    </form>
  );
}

export function TrialForm({ defaultProgram }: { defaultProgram?: (typeof PROGRAM_OPTIONS)[number] | undefined }) {
  const [done, setDone] = useState(false);
  const form = useForm<z.input<typeof trialSchema>, unknown, z.output<typeof trialSchema>>({
    resolver: zodResolver(trialSchema),
    defaultValues: defaultProgram ? { preferred_program: defaultProgram } : {},
  });
  const { register, handleSubmit, formState, reset } = form;
  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.from("trial_bookings").insert(values);
    if (error) return void toast.error(friendly(error.message));
    toast.success("Free trial booked! We'll confirm by phone.");
    reset();
    setDone(true);
  });
  if (done) return <Success title="Your free trial is booked!" text="A counsellor will call you to confirm the slot and share joining details." onReset={() => setDone(false)} />;
  const e = formState.errors;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <FormField label="Parent name" error={e.parent_name?.message} htmlFor="t-parent"><Input id="t-parent" autoComplete="name" {...register("parent_name")} /></FormField>
      <FormField label="Child name" error={e.child_name?.message} htmlFor="t-child"><Input id="t-child" {...register("child_name")} /></FormField>
      <FormField label="Child age" error={e.child_age?.message} htmlFor="t-age"><Input id="t-age" type="number" min={3} max={18} {...register("child_age")} /></FormField>
      <FormField label="Email" error={e.email?.message} htmlFor="t-email"><Input id="t-email" type="email" autoComplete="email" {...register("email")} /></FormField>
      <FormField label="Phone" error={e.phone?.message} htmlFor="t-phone"><Input id="t-phone" type="tel" autoComplete="tel" {...register("phone")} /></FormField>
      <FormField label="Preferred program" error={e.preferred_program?.message} htmlFor="t-program">
        <select id="t-program" className={selectClass} {...register("preferred_program")} defaultValue={defaultProgram ?? ""}>
          <option value="" disabled>Select a program</option>
          {PROGRAM_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </FormField>
      <FormField label="Preferred date" error={e.preferred_date?.message} htmlFor="t-date"><Input id="t-date" type="date" min={today} {...register("preferred_date")} /></FormField>
      <FormField label="Preferred time" error={e.preferred_time?.message} htmlFor="t-time">
        <select id="t-time" className={selectClass} {...register("preferred_time")} defaultValue="">
          <option value="" disabled>Select a time</option>
          {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </FormField>
      <Button type="submit" variant="brand" size="lg" className="sm:col-span-2" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Loader2 className="animate-spin" />} Book my free trial
      </Button>
    </form>
  );
}

export function SchoolPartnerForm() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<z.infer<typeof schoolSchema>>({ resolver: zodResolver(schoolSchema) });
  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.from("school_applications").insert({ ...values, message: values.message || null });
    if (error) return void toast.error(friendly(error.message));
    toast.success("Enquiry received! Our school team will reach out.");
    reset();
    setDone(true);
  });
  if (done) return <Success title="Thank you!" text="Our school partnerships team will contact you within 48 hours to schedule a lab walkthrough." onReset={() => setDone(false)} />;
  const e = formState.errors;
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <FormField label="School name" error={e.school_name?.message} htmlFor="s-name"><Input id="s-name" {...register("school_name")} /></FormField>
      <FormField label="School email" error={e.school_email?.message} htmlFor="s-email"><Input id="s-email" type="email" {...register("school_email")} /></FormField>
      <FormField label="Contact person" error={e.contact_person?.message} htmlFor="s-contact"><Input id="s-contact" {...register("contact_person")} /></FormField>
      <FormField label="Phone number" error={e.phone?.message} htmlFor="s-phone"><Input id="s-phone" type="tel" {...register("phone")} /></FormField>
      <FormField label="Address" error={e.address?.message} className="sm:col-span-2" htmlFor="s-address"><Input id="s-address" {...register("address")} /></FormField>
      <FormField label="City" error={e.city?.message} htmlFor="s-city"><Input id="s-city" {...register("city")} /></FormField>
      <FormField label="State" error={e.state?.message} htmlFor="s-state"><Input id="s-state" {...register("state")} /></FormField>
      <FormField label="Message" error={e.message?.message} className="sm:col-span-2" htmlFor="s-msg"><Textarea id="s-msg" rows={4} {...register("message")} /></FormField>
      <Button type="submit" variant="brand" size="lg" className="sm:col-span-2" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Loader2 className="animate-spin" />} Request a partnership call
      </Button>
    </form>
  );
}

export function FranchiseForm() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<z.infer<typeof franchiseSchema>>({ resolver: zodResolver(franchiseSchema) });
  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.from("franchise_applications").insert({ ...values, message: values.message || null });
    if (error) return void toast.error(friendly(error.message));
    toast.success("Application submitted!");
    reset();
    setDone(true);
  });
  if (done) return <Success title="Application received" text="Our franchise team will review your details and call you within 3 working days." onReset={() => setDone(false)} />;
  const e = formState.errors;
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <FormField label="Applicant name" error={e.applicant_name?.message} htmlFor="f-name"><Input id="f-name" autoComplete="name" {...register("applicant_name")} /></FormField>
      <FormField label="Email" error={e.email?.message} htmlFor="f-email"><Input id="f-email" type="email" {...register("email")} /></FormField>
      <FormField label="Phone" error={e.phone?.message} htmlFor="f-phone"><Input id="f-phone" type="tel" {...register("phone")} /></FormField>
      <FormField label="City" error={e.city?.message} htmlFor="f-city"><Input id="f-city" {...register("city")} /></FormField>
      <FormField label="State" error={e.state?.message} htmlFor="f-state"><Input id="f-state" {...register("state")} /></FormField>
      <FormField label="Investment capacity" error={e.investment_capacity?.message} htmlFor="f-invest">
        <select id="f-invest" className={selectClass} defaultValue="" {...register("investment_capacity")}>
          <option value="" disabled>Select a range</option>
          {INVESTMENT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </FormField>
      <FormField label="Business experience" error={e.business_experience?.message} className="sm:col-span-2" htmlFor="f-exp"><Textarea id="f-exp" rows={3} {...register("business_experience")} /></FormField>
      <FormField label="Message" error={e.message?.message} className="sm:col-span-2" htmlFor="f-msg"><Textarea id="f-msg" rows={3} {...register("message")} /></FormField>
      <Button type="submit" variant="brand" size="lg" className="sm:col-span-2" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Loader2 className="animate-spin" />} Submit application
      </Button>
    </form>
  );
}
