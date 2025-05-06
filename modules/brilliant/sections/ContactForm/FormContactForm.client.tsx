'use client';
import {HelpCircle, Mail, MapPin, Phone, ShoppingBag} from 'lucide-react';
import {useCallback, useMemo, useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';

import {Button} from '~/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form';
import {Input} from '~/components/ui/input';
import {Textarea} from '~/components/ui/textarea';

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export default function FormContactForm() {
  const form = useForm<ContactFormValues>({
    defaultValues: {name: '', email: '', message: ''},
  });

  let initialFormResult:
    | {
        success: boolean;
        message: string;
      }
    | undefined;

  const [formResult, setFormResult] = useState(initialFormResult);

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    try {
      const res = await fetch('https://formspree.io/f/mrbqqzan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFormResult({
          success: true,
          message:
            "Thanks!  We've received your submission and will reply to the email you included.",
        });
        form.reset();
      } else {
        console.error('Formspree error:', await res.text());
        setFormResult({
          success: false,
          message:
            'Ooops, something went wrong!, Try again, or contact via phone.',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    }
  };

  const resetForm = useCallback(() => {
    form.reset;
    setFormResult(undefined);
  }, [form.reset]);

  const formBackgroundColor = useMemo(
    () =>
      formResult
        ? formResult.success
          ? 'bg-green-200/50'
          : 'bg-red-200/50'
        : 'bg-white',
    [formResult],
  );

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-8">
        <h3 className="text-h3 text-3xl">Contact Us </h3>
        <div className="w-full px-4 md:w-1/2">
          <p className="text-center text-gray-500 ">
            Have questions about our products or services? We'd love to hear
            from you! Fill out the form below and we'll reply to you as soon as
            possible.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-2 py-8 sm:px-4 lg:px-6 ">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex justify-center">
            <Card className={`${formBackgroundColor} w-full max-w-lg `}>
              {formResult && (
                <CardHeader>
                  <CardTitle className="">
                    <h3>{formResult.message}</h3>
                  </CardTitle>
                </CardHeader>
              )}
              <CardHeader>
                <CardTitle>
                  <h3 className="text-h3 text-3xl">Send Us a Message</h3>
                </CardTitle>
              </CardHeader>

              <CardContent className="">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{required: 'Name is required'}}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{required: 'Email is required'}}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      rules={{required: 'Message is required'}}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Your message…"
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => resetForm}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <ContactUsCard />
            <QuickLinksCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactUsCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-h3 mb-4 font-heading text-3xl">
          Contact Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="mr-3 mt-0.5 size-5 shrink-0 text-[#1e40af]" />
            <div>
              <p className="font-medium">Our Location</p>
              <p className="font-normal text-muted-foreground">
                15 Colonial Terrace
              </p>
              <p className="font-normal text-muted-foreground">
                Pompton Plains, NJ 07444
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="mr-3 mt-0.5 size-5 shrink-0 text-[#1e40af]" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="font-normal text-muted-foreground">
                (201) 338-3090
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="mr-3 mt-0.5 size-5 shrink-0 text-[#1e40af]" />
            <div>
              <p className="font-medium">Email</p>
              <p className="font-normal text-muted-foreground">
                sales@brilliantlayers.com
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinksCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 font-heading text-lg">Quick Links</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start font-normal">
            <ShoppingBag className="mr-2 size-4" />
            Order Status
          </Button>
          <Button variant="outline" className="justify-start font-normal">
            <HelpCircle className="mr-2 size-4" />
            Returns Policy
          </Button>
          <Button variant="outline" className="justify-start font-normal">
            <ShoppingBag className="mr-2 size-4" />
            Shipping Info
          </Button>
          <Button variant="outline" className="justify-start font-normal">
            <HelpCircle className="mr-2 size-4" />
            FAQ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
