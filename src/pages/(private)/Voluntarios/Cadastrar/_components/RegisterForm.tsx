import { z } from 'zod';
import { User } from 'lucide-react';
import { useRef, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import useRegisterVolunteer from '../_hooks/useRegisterVolunteer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface VolunteerFormValues {
  name: string;
  cpf?: string;
  contact?: string;
  birthDate?: string;
  image?: FileList;
}

const volunteerSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  cpf: z.string().optional(),
  contact: z.string().optional(),
  birthDate: z.string().optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine((list) => !list || list.length === 1, 'Envie apenas um arquivo'),
});

export default function RegisterForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: '',
      cpf: '',
      contact: '',
      birthDate: '',
      image: undefined,
    },
  });

  const { mutate, isPending } = useRegisterVolunteer(setPreview, form);

  const onSubmit = (values: VolunteerFormValues) => {
    const fd = new FormData();
    fd.append('name', values.name);
    if (values.cpf) fd.append('cpf', values.cpf);
    if (values.contact) fd.append('contact', values.contact);
    if (values.birthDate) fd.append('birthDate', values.birthDate);
    if (values.image && values.image.length > 0) {
      fd.append('image', values.image[0]);
    }
    mutate(fd);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* CARD MAIOR: campos de texto */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            {/* Nome */}
            <div className="space-y-1">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...form.register('name')} placeholder="Nome completo" />
              {form.formState.errors.name && (
                <p className="text-red-600 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* CPF */}
            <div className="space-y-1">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" {...form.register('cpf')} placeholder="123.456.789-00" />
              {form.formState.errors.cpf && <p className="text-red-600 text-sm">{form.formState.errors.cpf.message}</p>}
            </div>

            {/* Contato */}
            <div className="space-y-1">
              <Label htmlFor="contact">Contato</Label>
              <Input id="contact" {...form.register('contact')} placeholder="(XX) XXXXX-XXXX" />
              {form.formState.errors.contact && (
                <p className="text-red-600 text-sm">{form.formState.errors.contact.message}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-1">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input id="birthDate" type="date" {...form.register('birthDate')} />
              {form.formState.errors.birthDate && (
                <p className="text-red-600 text-sm">{form.formState.errors.birthDate.message}</p>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="flex flex-col gap-4 w-full lg:w-80">
            {/* PREVIEW */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Avatar</h4>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 cursor-pointer" onClick={() => inputRef.current?.click()}>
                  {preview ? (
                    <AvatarImage src={preview} alt="Avatar Preview" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-1">
                  <Controller
                    name="image"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            field.onChange(files);
                            setPreview(files && files[0] ? URL.createObjectURL(files[0]) : null);
                          }}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                          Selecionar imagem
                        </Button>
                        {fieldState.error && <p className="text-red-600 text-sm">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* BOTÃO CADASTRAR */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Cadastrar'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
