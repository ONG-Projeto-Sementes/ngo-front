import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X } from 'lucide-react';
import { eventEditSchema } from '../../_schemas';
import { useEditEvent } from '../../_hooks/useEditEvent';
import type { EventEditFormValues } from '../../_hooks/useEditEvent';

interface Props {
  eventId: string;
}

export default function EditForm({ eventId }: Props) {
  const { data, isLoading, isError, error, mutate, isPending } = useEditEvent(eventId);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EventEditFormValues>({
    resolver: zodResolver(eventEditSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      maxVolunteers: undefined,
      image: undefined,
    },
  });

  // Quando o fetch chega, popula o form
  useEffect(() => {
    if (!data) return;
    
    form.setValue('title', data.title);
    form.setValue('description', data.description || '');
    form.setValue('location', data.location || '');
    
    // Formatar datas para input datetime-local
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      form.setValue('startDate', startDate.toISOString().slice(0, 16));
    }
    
    if (data.endDate) {
      const endDate = new Date(data.endDate);
      form.setValue('endDate', endDate.toISOString().slice(0, 16));
    }
    
    form.setValue('maxVolunteers', data.maxVolunteers || undefined);
    
    // Definir preview da imagem existente
    if (data.image) {
      setPreview(data.image);
    }
  }, [data, form]);

  const onSubmit = (values: EventEditFormValues) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    if (values.description?.trim()) {
      formData.append('description', values.description.trim());
    }
    if (values.location?.trim()) {
      formData.append('location', values.location.trim());
    }
    formData.append('startDate', values.startDate);
    if (values.endDate?.trim()) {
      formData.append('endDate', values.endDate.trim());
    }
    if (values.maxVolunteers && values.maxVolunteers > 0) {
      formData.append('maxVolunteers', values.maxVolunteers.toString());
    }
    
    // Só adiciona imagem se foi realmente selecionada uma nova
    if (values.image && values.image instanceof FileList && values.image.length > 0) {
      formData.append('image', values.image[0]);
    }

    mutate(formData);
  };

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreview = () => {
    setPreview(data?.image || null);
    form.setValue('image', undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto mt-6">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-2xl mx-auto mt-6">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar evento: {(error as Error)?.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Editar Evento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o evento..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data/Hora de Início *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data/Hora de Fim</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxVolunteers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Máximo de Voluntários</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="Deixe em branco para ilimitado"
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Imagem do Evento</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              form.setValue('image', files);
                              handleImageChange(files);
                            }
                          }}
                          className="hidden"
                        />
                        <div 
                          className="flex flex-col items-center justify-center py-4 cursor-pointer"
                          onClick={() => inputRef.current?.click()}
                        >
                          {preview ? (
                            <div className="relative">
                              <img 
                                src={preview} 
                                alt="Preview" 
                                className="max-w-full max-h-48 rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePreview();
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Camera className="w-12 h-12 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-1">Clique para selecionar uma imagem</p>
                              <p className="text-xs text-gray-400">PNG, JPG até 10MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
