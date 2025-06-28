import { z } from 'zod';
import { User } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEditVolunteer, type VolunteerEditFormValues } from '../_hooks/useEditVolunteer';

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

interface Props {
  volunteerId: string;
}

export default function EditForm({ volunteerId }: Props) {
  const { data, isLoading, isError, error, mutate, isPending } = useEditVolunteer(volunteerId);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<VolunteerEditFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: '',
      cpf: '',
      contact: '',
      birthDate: '',
      image: undefined,
    },
  });

  // quando o fetch chega, popula o form
  useEffect(() => {
    if (!data) return;
    form.setValue('name', data.name);
    form.setValue('cpf', data.cpf ?? '');
    form.setValue('contact', data.contact ?? '');
    form.setValue('birthDate', data.birthDate?.slice(0, 10) ?? '');
    if (data.profilePicture) setPreview(data.profilePicture);
  }, [data, form]);

  const onSubmit = (vals: VolunteerEditFormValues) => {
    const fd = new FormData();
    fd.append('name', vals.name);
    if (vals.cpf) fd.append('cpf', vals.cpf);
    if (vals.contact) fd.append('contact', vals.contact);
    if (vals.birthDate) fd.append('birthDate', vals.birthDate);
    if (vals.image && vals.image.length > 0) {
      fd.append('image', vals.image[0]);
    }
    mutate(fd);
  };

  if (isLoading) return <p>Carregando voluntário...</p>;
  if (isError) return <p className="text-red-600">{(error as Error).message}</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campos de texto */}
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

          {/* Preview + submit */}
          <div className="flex flex-col gap-4 w-full lg:w-80">
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Avatar</h4>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 cursor-pointer" onClick={() => inputRef.current?.click()}>
                  {preview ? (
                    <AvatarImage src={preview} alt="Preview" />
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

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Atualizando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
