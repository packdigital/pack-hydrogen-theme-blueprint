export type Action = {type: string; payload?: any};

export type Dispatch = ({type, payload}: Action) => void;

export type Modal = {
  children: React.ReactNode | null;
  props?: Record<string, any>;
};

export interface GlobalState {
  cartOpen: boolean;
  modal: Modal;
  searchOpen: boolean;
  emitter: any;
}

export interface GlobalActions {
  openCart: () => void;
  closeCart: () => void;
  openModal: (children: React.ReactNode, props?: Record<string, any>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export interface GlobalContext {
  state: GlobalState;
  actions: GlobalActions;
}
