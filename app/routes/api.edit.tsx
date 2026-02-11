import {previewModeAction, previewModeLoader} from '@pack/hydrogen';
import type {ActionFunction, LoaderFunction} from 'react-router';

export const action: ActionFunction = previewModeAction;
export const loader: LoaderFunction = previewModeLoader;
