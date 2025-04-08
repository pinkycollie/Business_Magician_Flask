import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Define form schema
const formSchema = z.object({
  interests: z.array(z.string()).min(1, 'Add at least one interest or skill'),
  marketInfo: z.string().optional(),
  constraints: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type BusinessIdea = {
  title: string;
  description: string;
  marketPotential: string;
  difficultyLevel: string;
  startupCosts: string;
};

const BusinessIdeaGenerator: React.FC = () => {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentConstraint, setCurrentConstraint] = useState('');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      marketInfo: '',
      constraints: [],
    },
  });

  const { mutate, isPending } = useMutation<{ ideas: BusinessIdea[] }, Error, FormValues>({
    mutationFn: async (data: FormValues) => {
      return apiRequest<{ ideas: BusinessIdea[] }>('/api/tools/generate-ideas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setIdeas(data.ideas);
      toast({
        title: 'Ideas Generated',
        description: 'Your personalized business ideas are ready!',
      });
    },
    onError: (error: any) => {
      console.error('Error generating ideas:', error);
      
      // Check if the error is due to missing API key
      if (error.response?.status === 503 && error.response?.data?.missingApiKey) {
        setApiKeyMissing(true);
        toast({
          title: 'API Key Required',
          description: 'OpenAI API key is not configured. Please contact the administrator.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to generate business ideas. Please try again.',
          variant: 'destructive',
        });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  const addInterest = () => {
    if (currentInterest.trim()) {
      const updated = [...form.getValues().interests, currentInterest.trim()];
      form.setValue('interests', updated, { shouldValidate: true });
      setCurrentInterest('');
    }
  };

  const removeInterest = (index: number) => {
    const updated = form.getValues().interests.filter((_, i) => i !== index);
    form.setValue('interests', updated, { shouldValidate: true });
  };

  const addConstraint = () => {
    if (currentConstraint.trim()) {
      const updated = [...(form.getValues().constraints || []), currentConstraint.trim()];
      form.setValue('constraints', updated);
      setCurrentConstraint('');
    }
  };

  const removeConstraint = (index: number) => {
    const updated = (form.getValues().constraints || []).filter((_, i) => i !== index);
    form.setValue('constraints', updated);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Generate Business Ideas</h3>
          
          {apiKeyMissing && (
            <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-md">
              <h4 className="font-bold">OpenAI API Key Required</h4>
              <p className="text-sm">
                This feature requires an OpenAI API key to generate personalized business ideas. 
                Please contact the administrator to set up the API key.
              </p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel>Interests & Skills</FormLabel>
                    <div className="flex">
                      <Input
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        placeholder="e.g., technology, design, cooking"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addInterest}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.getValues().interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {interest}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeInterest(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Add your personal interests and skills to help generate relevant ideas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any market opportunities or trends you're aware of"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide information about market trends or specific customer needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constraints"
                render={() => (
                  <FormItem>
                    <FormLabel>Business Constraints (Optional)</FormLabel>
                    <div className="flex">
                      <Input
                        value={currentConstraint}
                        onChange={(e) => setCurrentConstraint(e.target.value)}
                        placeholder="e.g., low startup cost, work from home"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addConstraint}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.getValues().constraints || []).map((constraint, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {constraint}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeConstraint(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Add any specific requirements or limitations for your business.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  'Generate Business Ideas'
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Your Business Ideas</h3>
          
          {ideas.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
              <div>
                <div className="mb-2 text-3xl text-slate-300">💡</div>
                <p className="text-slate-500">
                  Your AI-generated business ideas will appear here
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Fill out the form and click "Generate Business Ideas"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{idea.title}</CardTitle>
                    <CardDescription>{idea.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-slate-500">Market Potential</div>
                        <div className={`
                          mt-1 font-semibold
                          ${idea.marketPotential.toLowerCase() === 'high' && 'text-green-600'}
                          ${idea.marketPotential.toLowerCase() === 'medium' && 'text-amber-600'}
                          ${idea.marketPotential.toLowerCase() === 'low' && 'text-red-600'}
                        `}>
                          {idea.marketPotential}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-slate-500">Difficulty</div>
                        <div className={`
                          mt-1 font-semibold
                          ${idea.difficultyLevel.toLowerCase() === 'low' && 'text-green-600'}
                          ${idea.difficultyLevel.toLowerCase() === 'medium' && 'text-amber-600'}
                          ${idea.difficultyLevel.toLowerCase() === 'high' && 'text-red-600'}
                        `}>
                          {idea.difficultyLevel}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-slate-500">Startup Costs</div>
                        <div className="mt-1 font-semibold">{idea.startupCosts}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Analyze This Idea
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessIdeaGenerator;