"use client";

import { useState } from "react";
import type { CustomerAddress } from "@/lib/customer/types";
import {
  accountButtonClass,
  accountFieldClass,
  accountLabelClass,
} from "./form-styles";

const emptyForm = {
  title: "",
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  district: "",
  neighborhood: "",
  addressLine: "",
  postalCode: "",
};

export function AddressBook({ initial }: { initial: CustomerAddress[] }) {
  const [addresses, setAddresses] = useState(initial);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function startEdit(address: CustomerAddress) {
    setEditingId(address.id);
    setForm({
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood ?? "",
      addressLine: address.addressLine,
      postalCode: address.postalCode,
    });
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (
      !form.title.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.district.trim() ||
      !form.addressLine.trim()
    ) {
      setError("Lütfen bilgilerinizi kontrol edin.");
      return;
    }
    setPending(true);
    try {
      const url = editingId
        ? `/api/customer/addresses/${encodeURIComponent(editingId)}`
        : "/api/customer/addresses";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          neighborhood: form.neighborhood.trim() || undefined,
          addressLine: form.addressLine.trim(),
          postalCode: form.postalCode.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        address?: CustomerAddress;
      } | null;
      if (!res.ok || !data?.address) {
        setError(data?.error || "Lütfen bilgilerinizi kontrol edin.");
        return;
      }
      setAddresses((current) => {
        if (editingId) {
          return current.map((row) => (row.id === editingId ? data.address! : row));
        }
        return [data.address!, ...current];
      });
      resetForm();
    } catch {
      setError("İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Bu adresi silmek istiyor musunuz?")) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/customer/addresses/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Adres silinemedi.");
        return;
      }
      setAddresses((current) => current.filter((row) => row.id !== id));
      if (editingId === id) resetForm();
    } catch {
      setError("İşlem şu anda gerçekleştirilemiyor. Lütfen biraz sonra tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      ) : null}

      {addresses.length === 0 ? (
        <p className="text-sm text-[var(--color-anthracite-soft)]">
          Kayıtlı adresiniz yok. Aşağıdan ekleyebilirsiniz.
        </p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="border-b border-black/[0.06] pb-4 last:border-0"
            >
              <p className="font-semibold text-[var(--color-espresso)]">{address.title}</p>
              <p className="mt-1 text-sm text-[var(--color-anthracite-soft)]">
                {address.firstName} {address.lastName}
                <br />
                {address.addressLine}
                {address.neighborhood ? `, ${address.neighborhood}` : ""}
                <br />
                {address.district} / {address.city}
                {address.postalCode ? ` ${address.postalCode}` : ""}
                <br />
                {address.phone}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--color-espresso)] underline-offset-2 hover:underline"
                  onClick={() => startEdit(address)}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--color-taupe-muted)] underline-offset-2 hover:underline"
                  onClick={() => void onDelete(address.id)}
                  disabled={pending}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        <h2 className="text-lg font-semibold text-[var(--color-espresso)]">
          {editingId ? "Adresi düzenle" : "Yeni adres"}
        </h2>
        <div>
          <label htmlFor="addr-title" className={accountLabelClass}>
            Adres başlığı
          </label>
          <input
            id="addr-title"
            autoComplete="nickname"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={accountFieldClass}
            placeholder="Ev, iş…"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="addr-first" className={accountLabelClass}>
              Ad
            </label>
            <input
              id="addr-first"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={accountFieldClass}
            />
          </div>
          <div>
            <label htmlFor="addr-last" className={accountLabelClass}>
              Soyad
            </label>
            <input
              id="addr-last"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={accountFieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="addr-phone" className={accountLabelClass}>
            Telefon
          </label>
          <input
            id="addr-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={accountFieldClass}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="addr-city" className={accountLabelClass}>
              İl
            </label>
            <input
              id="addr-city"
              autoComplete="address-level1"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={accountFieldClass}
            />
          </div>
          <div>
            <label htmlFor="addr-district" className={accountLabelClass}>
              İlçe
            </label>
            <input
              id="addr-district"
              autoComplete="address-level2"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className={accountFieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="addr-hood" className={accountLabelClass}>
            Mahalle <span className="font-normal text-[var(--color-taupe-muted)]">(isteğe bağlı)</span>
          </label>
          <input
            id="addr-hood"
            value={form.neighborhood}
            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
            className={accountFieldClass}
          />
        </div>
        <div>
          <label htmlFor="addr-line" className={accountLabelClass}>
            Açık adres
          </label>
          <textarea
            id="addr-line"
            autoComplete="street-address"
            rows={3}
            value={form.addressLine}
            onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
            className={`${accountFieldClass} resize-y py-3`}
          />
        </div>
        <div>
          <label htmlFor="addr-postal" className={accountLabelClass}>
            Posta kodu <span className="font-normal text-[var(--color-taupe-muted)]">(isteğe bağlı)</span>
          </label>
          <input
            id="addr-postal"
            autoComplete="postal-code"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            className={accountFieldClass}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className={accountButtonClass} disabled={pending}>
            {pending ? "Kaydediliyor…" : editingId ? "Adresi güncelle" : "Adres ekle"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-black/12 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)]"
            >
              Vazgeç
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
