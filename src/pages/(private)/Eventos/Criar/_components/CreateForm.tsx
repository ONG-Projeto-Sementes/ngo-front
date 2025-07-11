import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X } from 'lucide-react';
import { eventSchema } from '../../_schemas';
import useCreateEvent from '../../_hooks/useCreateEvent';
import type { EventFormValues } from '../../_types';

export default function CreateForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
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

  const { mutate, isPending } = useCreateEvent(setPreview, form);

  const onSubmit = (values: EventFormValues) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    if (values.location) formData.append('location', values.location);
    formData.append('startDate', values.startDate);
    if (values.endDate) formData.append('endDate', values.endDate);
    if (values.maxVolunteers) formData.append('maxVolunteers', values.maxVolunteers.toString());
    
    if (values.image && values.image.length > 0) {
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
    setPreview(null);
    form.setValue('image', undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Informações do Evento</CardTitle>
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
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                            form.setValue('image', files as FileList);
                            handleImageChange(files);
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
                    Criando...
                  </>
                ) : (
                  'Criar Evento'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Limpar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
