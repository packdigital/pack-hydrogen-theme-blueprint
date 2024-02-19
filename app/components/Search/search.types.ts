import type {Product, Collection} from '@shopify/hydrogen/storefront-api-types';

type CloseSearch = () => void;
type HandleSuggestion = (term: string) => void;
type HandleInput = (e: React.ChangeEvent<HTMLInputElement>) => void;

export interface SearchAutocompleteProps {
  handleSuggestion: HandleSuggestion;
  searchTerm: string;
}

export interface SearchInputProps {
  closeSearch: CloseSearch;
  handleClear: () => void;
  handleInput: HandleInput;
  handleSuggestion: HandleSuggestion;
  rawTerm: string;
  searchOpen: boolean;
  searchTerm: string;
}

export interface SearchItemProps {
  closeSearch: CloseSearch;
  index: number;
  item: Product;
  searchTerm: string;
}

export interface SearchResultsProps {
  closeSearch: CloseSearch;
  productResults: Product[];
  collectionResults: Collection[];
  searchTerm: string;
}

export interface SearchSuggestionsProps {
  handleSuggestion: HandleSuggestion;
  hasNoProductResults: boolean;
}
