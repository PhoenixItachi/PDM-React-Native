import {action, getLogger, errorPayload} from '../core/utils';
import {search, save} from './resource';

const log = getLogger('Anime/service');

// Loading Animes
const LOAD_ANIMES_STARTED = 'Anime/loadStarted';
const LOAD_ANIMES_SUCCEEDED = 'Anime/loadSucceeded';
const LOAD_ANIMES_FAILED = 'Anime/loadFailed';
const CANCEL_LOAD_ANIMES = 'Anime/cancelLoad';

// Saving Animes
const SAVE_ANIME_STARTED = 'Anime/saveStarted';
const SAVE_ANIME_SUCCEEDED = 'Anime/saveSucceeded';
const SAVE_ANIME_FAILED = 'Anime/saveFailed';
const CANCEL_SAVE_ANIME = 'Anime/cancelSave';

// Anime notifications
const ANIME_DELETED = 'Anime/deleted';

export const loadAnimes = () => async(dispatch, getState) => {
  log(`loadAnimes...`);
  const state = getState();
  const animeState = state.Anime;
  try {
    dispatch(action(LOAD_ANIMES_STARTED));
    const Animes = await search(state.auth.server, state.auth.token)
    log(`loadAnimes succeeded`);
    if (!animeState.isLoadingCancelled) {
      dispatch(action(LOAD_ANIMES_SUCCEEDED, Animes));
    }
  } catch(err) {
    log(`loadAnimes failed`);
    if (!animeState.isLoadingCancelled) {
      dispatch(action(LOAD_ANIMES_FAILED, errorPayload(err)));
    }
  }
};

export const cancelLoadAnimes = () => action(CANCEL_LOAD_ANIMES);

export const saveAnime = (Anime) => async(dispatch, getState) => {
  log(`saveAnime...`);
  const state = getState();
  const animeState = state.Anime;
  try {
    dispatch(action(SAVE_ANIME_STARTED));
    const savedAnime = await save(state.auth.server, state.auth.token, Anime)
    log(`saveAnime succeeded`);
    if (!animeState.isSavingCancelled) {
      dispatch(action(SAVE_ANIME_SUCCEEDED, savedAnime));
    }
  } catch(err) {
    log(`saveAnime failed`);
    if (!animeState.isSavingCancelled) {
      dispatch(action(SAVE_ANIME_FAILED, errorPayload(err)));
    }
  }
};

export const cancelSaveAnime = () => action(CANCEL_SAVE_Anime);

export const AnimeCreated = (createdAnime) => action(SAVE_ANIME_SUCCEEDED, createdAnime);
export const AnimeUpdated = (updatedAnime) => action(SAVE_ANIME_SUCCEEDED, updatedAnime);
export const AnimeDeleted = (deletedAnime) => action(ANIME_DELETED, deletedAnime);

export const animeReducer = (state = {items: [], isLoading: false, isSaving: false}, action) => { //newState (new object)
  let items, index;
  switch (action.type) {
    // Loading
    case LOAD_ANIMES_STARTED:
      return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
    case LOAD_ANIMES_SUCCEEDED:
      return {...state, items: action.payload, isLoading: false};
    case LOAD_ANIMES_FAILED:
      return {...state, issue: action.payload.issue, isLoading: false};
    case CANCEL_LOAD_ANIMES:
      return {...state, isLoading: false, isLoadingCancelled: true};
    // Saving
    case SAVE_ANIME_STARTED:
      return {...state, isSaving: true, isSavingCancelled: false, issue: null};
    case SAVE_ANIME_SUCCEEDED:
      items = [...state.items];
      index = items.findIndex((i) => i.id == action.payload.id);
      if (index != -1) {
        items.splice(index, 1, action.payload);
      } else {
        items.push(action.payload);
      }
      return {...state, items, isSaving: false};
    case SAVE_ANIME_FAILED:
      return {...state, issue: action.payload.issue, isSaving: false};
    case CANCEL_SAVE_ANIME:
      return {...state, isSaving: false, isSavingCancelled: true};
    // Notifications
    case ANIME_DELETED:
      items = [...state.items];
      const deletedAnime = action.payload;
      index = state.items.findIndex((Anime) => Anime.id == deletedAnime.id);
      if (index != -1) {
        items.splice(index, 1);
        return {...state, items};
      }
      return state;
    default:
      return state;
  }
};
