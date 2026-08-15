export interface ProducerProfile {
  producerId: string;
  nomeArtistico: string;
  biografia: string;
  avatarUrl: string;
}

export const EMPTY_PRODUCER_PROFILE: ProducerProfile = {
  producerId: '',
  nomeArtistico: '',
  biografia: '',
  avatarUrl: '',
};
