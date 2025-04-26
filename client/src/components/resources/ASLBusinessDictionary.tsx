import React, { useState, MouseEvent } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Video,
  BookOpen,
  Tag,
  X,
  ChevronDown,
  Play,
  List,
  Grid3X3
} from 'lucide-react';

// Interface for ASL dictionary term
interface ASLTerm {
  id: string;
  term: string;
  definition: string;
  category: 'financial' | 'legal' | 'marketing' | 'operations' | 'planning' | 'management';
  relatedTerms: string[];
  videoUrl: string;
  thumbnailUrl: string;
}

// Sample data for ASL business dictionary
const aslTermsData: ASLTerm[] = [
  {
    id: '1',
    term: 'Business Plan',
    definition: 'A written document that describes in detail how a business defines its objectives and how it plans to achieve its goals.',
    category: 'planning',
    relatedTerms: ['Executive Summary', 'Financial Projections', 'Market Analysis'],
    videoUrl: '/videos/asl/business-plan.mp4',
    thumbnailUrl: '/images/thumbnails/business-plan.jpg'
  },
  {
    id: '2',
    term: 'Cash Flow',
    definition: 'The net amount of cash and cash-equivalents being transferred into and out of a business.',
    category: 'financial',
    relatedTerms: ['Revenue', 'Expenses', 'Profit'],
    videoUrl: '/videos/asl/cash-flow.mp4',
    thumbnailUrl: '/images/thumbnails/cash-flow.jpg'
  },
  {
    id: '3',
    term: 'LLC (Limited Liability Company)',
    definition: 'A business structure that combines the pass-through taxation of a partnership or sole proprietorship with the limited liability of a corporation.',
    category: 'legal',
    relatedTerms: ['Corporation', 'Partnership', 'Sole Proprietorship'],
    videoUrl: '/videos/asl/llc.mp4',
    thumbnailUrl: '/images/thumbnails/llc.jpg'
  },
  {
    id: '4',
    term: 'ROI (Return on Investment)',
    definition: 'A performance measure used to evaluate the efficiency of an investment or compare the efficiency of a number of different investments.',
    category: 'financial',
    relatedTerms: ['Investment', 'Profit', 'Capital'],
    videoUrl: '/videos/asl/roi.mp4',
    thumbnailUrl: '/images/thumbnails/roi.jpg'
  },
  {
    id: '5',
    term: 'Market Segmentation',
    definition: 'The process of dividing a market of potential customers into groups, or segments, based on different characteristics.',
    category: 'marketing',
    relatedTerms: ['Target Market', 'Demographics', 'Customer Profile'],
    videoUrl: '/videos/asl/market-segmentation.mp4',
    thumbnailUrl: '/images/thumbnails/market-segmentation.jpg'
  },
  {
    id: '6',
    term: 'Break-Even Point',
    definition: 'The point at which total cost and total revenue are equal, meaning there is no net loss or gain.',
    category: 'financial',
    relatedTerms: ['Fixed Costs', 'Variable Costs', 'Profit Margin'],
    videoUrl: '/videos/asl/break-even.mp4',
    thumbnailUrl: '/images/thumbnails/break-even.jpg'
  },
  {
    id: '7',
    term: 'Intellectual Property',
    definition: 'Creations of the mind, such as inventions, literary and artistic works, designs, symbols, names, and images used in commerce.',
    category: 'legal',
    relatedTerms: ['Copyright', 'Trademark', 'Patent'],
    videoUrl: '/videos/asl/intellectual-property.mp4',
    thumbnailUrl: '/images/thumbnails/intellectual-property.jpg'
  },
  {
    id: '8',
    term: 'Business Credit',
    definition: 'The ability of a business to qualify for and obtain financing, resources, and favorable terms from vendors and lenders.',
    category: 'financial',
    relatedTerms: ['Credit Score', 'Loan', 'Financing'],
    videoUrl: '/videos/asl/business-credit.mp4',
    thumbnailUrl: '/images/thumbnails/business-credit.jpg'
  },
  {
    id: '9',
    term: 'Sales Funnel',
    definition: 'A consumer-focused marketing model that illustrates the theoretical customer journey towards the purchase of a product or service.',
    category: 'marketing',
    relatedTerms: ['Lead Generation', 'Conversion', 'Customer Acquisition'],
    videoUrl: '/videos/asl/sales-funnel.mp4',
    thumbnailUrl: '/images/thumbnails/sales-funnel.jpg'
  },
  {
    id: '10',
    term: 'Equity',
    definition: 'Ownership interest in a company, represented by shares of stock or ownership percentages.',
    category: 'financial',
    relatedTerms: ['Shareholders', 'Ownership', 'Stock'],
    videoUrl: '/videos/asl/equity.mp4',
    thumbnailUrl: '/images/thumbnails/equity.jpg'
  },
  {
    id: '11',
    term: 'Supply Chain',
    definition: 'The network of all individuals, organizations, resources, activities and technology involved in the creation and sale of a product.',
    category: 'operations',
    relatedTerms: ['Logistics', 'Inventory', 'Procurement'],
    videoUrl: '/videos/asl/supply-chain.mp4',
    thumbnailUrl: '/images/thumbnails/supply-chain.jpg'
  },
  {
    id: '12',
    term: 'Business Model Canvas',
    definition: 'A strategic management template for developing new or documenting existing business models.',
    category: 'planning',
    relatedTerms: ['Value Proposition', 'Customer Segments', 'Revenue Streams'],
    videoUrl: '/videos/asl/business-model-canvas.mp4',
    thumbnailUrl: '/images/thumbnails/business-model-canvas.jpg'
  }
];

// Helper function to get color based on term category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'legal':
      return 'bg-blue-100 text-blue-800';
    case 'financial':
      return 'bg-green-100 text-green-800';
    case 'marketing':
      return 'bg-purple-100 text-purple-800';
    case 'operations':
      return 'bg-orange-100 text-orange-800';
    case 'planning':
      return 'bg-amber-100 text-amber-800';
    case 'management':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ASLBusinessDictionary() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTerm, setSelectedTerm] = useState<ASLTerm | null>(null);
  
  // Filter terms based on search and category
  const filteredTerms = aslTermsData.filter(term => {
    // Match search term
    if (searchTerm && !term.term.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !term.definition.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !term.relatedTerms.some(related => related.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && term.category !== selectedCategory) return false;
    
    return true;
  });

  // Open term detail modal
  const openTermDetail = (term: ASLTerm) => {
    setSelectedTerm(term);
  };

  // Close term detail modal
  const closeTermDetail = () => {
    setSelectedTerm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ASL Business Dictionary</h2>
          <p className="text-slate-500">
            Business terms explained in American Sign Language
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" 
            onClick={() => setViewMode('grid')} 
            className={viewMode === 'grid' ? 'bg-slate-100' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" 
            onClick={() => setViewMode('list')} 
            className={viewMode === 'list' ? 'bg-slate-100' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search business terms..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <select 
              className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
              <option value="planning">Planning</option>
              <option value="management">Management</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
        
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-md">
            <p className="text-slate-500">No business terms match your search. Try different keywords or categories.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => openTermDetail(term)}
              >
                <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-40 bg-slate-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-10 w-10 text-slate-400" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <Badge 
                      className={`absolute top-2 right-2 ${getCategoryColor(term.category)}`}
                    >
                      {term.category.charAt(0).toUpperCase() + term.category.slice(1)}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-lg">{term.term}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 line-clamp-2">{term.definition}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <div 
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md cursor-pointer"
                  onClick={() => openTermDetail(term)}
                >
                  <div className="flex-shrink-0 w-full sm:w-48 h-28 bg-slate-100 rounded-md relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-8 w-8 text-slate-400" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity rounded-md">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <h3 className="font-medium text-lg">{term.term}</h3>
                      <Badge className={getCategoryColor(term.category)}>
                        {term.category.charAt(0).toUpperCase() + term.category.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{term.definition}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {term.relatedTerms.slice(0, 2).map(related => (
                        <Badge key={related} variant="outline" className="text-xs">
                          {related}
                        </Badge>
                      ))}
                      {term.relatedTerms.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{term.relatedTerms.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Term Detail Modal */}
      <AnimatePresence>
        {selectedTerm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTermDetail}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative h-72 bg-slate-800 flex items-center justify-center">
                <Video className="h-16 w-16 text-white opacity-50" />
                <Button 
                  variant="default" 
                  size="lg"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 p-0"
                >
                  <Play className="h-8 w-8" />
                </Button>
                <Badge 
                  className={`absolute top-4 right-4 ${getCategoryColor(selectedTerm.category)}`}
                >
                  {selectedTerm.category.charAt(0).toUpperCase() + selectedTerm.category.slice(1)}
                </Badge>
                <button 
                  className="absolute top-4 left-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white"
                  onClick={closeTermDetail}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedTerm.term}</h2>
                <p className="text-slate-600 mb-6">{selectedTerm.definition}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Related Terms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTerms.map(term => (
                      <Badge key={term} variant="secondary" className="px-3 py-1">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={closeTermDetail}>
                    Close
                  </Button>
                  <Button variant="default" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}