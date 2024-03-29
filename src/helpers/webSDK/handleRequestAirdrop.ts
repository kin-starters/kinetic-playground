import { KineticSdk } from '@kin-kinetic/sdk';

interface HandleRequestAirdrop {
  kineticClient: KineticSdk;
  to: string;
  amount: string;
  kinNetwork: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
  kineticClient,
}: HandleRequestAirdrop) {
  console.log('🚀 ~ handleRequestAirdrop', to, amount);
  try {
    const airdrop = await kineticClient.requestAirdrop({
      account: to,
      amount: amount,
    });
    console.log('🚀 ~ airdrop', airdrop);

    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
