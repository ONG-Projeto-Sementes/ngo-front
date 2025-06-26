'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import useMutation from '@/hooks/useMutation';
import postVolunteer from '@/services/volunteer/postVolunteer';
import InputField from '@/components/InputField/InputField';

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

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export default function Cadastrar() {
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

  const { mutate, isPending, error } = useMutation<
    FormData,
    Awaited<ReturnType<typeof postVolunteer>>
  >((formData) => postVolunteer(formData));

  const onSubmit = (values: VolunteerFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.cpf)       formData.append('cpf', values.cpf);
    if (values.contact)   formData.append('contact', values.contact);
    if (values.birthDate) formData.append('birthDate', values.birthDate);
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    }
    mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputField name="name" label="Nome" placeholder="Nome completo" control={form.control} />
        <InputField name="cpf" label="CPF" placeholder="12345678901" control={form.control} />
        <InputField name="contact" label="Contato" placeholder="(XX) XXXXX-XXXX" control={form.control} />
        <InputField name="birthDate" label="Data de Nascimento" type="date" control={form.control} />

        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  field.onChange(files);
                  if (files && files[0]) {
                    setPreview(URL.createObjectURL(files[0]));
                  } else {
                    setPreview(null);
                  }
                }}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
              {preview && (
                <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded border" />
              )}
            </div>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Enviando...' : 'Cadastrar'}
        </Button>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </form>
    </Form>
  );
}
