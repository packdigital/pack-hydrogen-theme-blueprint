/* TEMPORARY local-only harness for verifying the Rivo sections mount. Not committed. */
import {RivoLoyaltyHero} from '~/sections/RivoLoyaltyHero';
import {RivoWaysToEarn} from '~/sections/RivoWaysToEarn';
import {RivoTierBenefits} from '~/sections/RivoTierBenefits';
import {RivoRewards} from '~/sections/RivoRewards';
import {RivoPointsHistory} from '~/sections/RivoPointsHistory';
import {RivoReferral} from '~/sections/RivoReferral';

const container = {} as any;

export default function RivoPreview() {
  return (
    <div>
      <RivoLoyaltyHero
        cms={{
          container,
          eyebrow: 'Free to join',
          heading: 'Rewards',
          subtext: 'Join to start earning points on every purchase.',
          buttons: [
            {link: {text: 'Join now', url: '/account/login', newTab: false, isExternal: false, type: 'isPage'}, style: 'btn-primary'},
          ],
          member: {greeting: 'Welcome back, {{name}}', pointsSuffix: 'points available'},
        }}
      />
      <RivoWaysToEarn
        cms={{container, eyebrow: 'Rewards with benefits', heading: 'How to earn'}}
      />
      <RivoTierBenefits
        cms={{
          container,
          heading: 'Tiers & benefits',
          tiers: [
            {name: 'Bronze', tagline: 'Start earning.', thresholdLabel: 'Free to join',
             perks: [{text: 'Earn 1 point per $1'}],
             benefits: [{label: 'Points per $1', value: '1'}, {label: 'Birthday reward', value: '150 points'}]},
            {name: 'Silver', tagline: 'Level up.',
             perks: [{text: 'Earn 2 points per $1'}, {text: 'Early access'}],
             benefits: [{label: 'Points per $1', value: '2'}, {label: 'Birthday reward', value: '300 points'}, {label: 'Early access', value: 'true'}]},
            {name: 'Gold', tagline: 'All access.',
             perks: [{text: 'Earn 3 points per $1'}, {text: 'VIP support'}],
             benefits: [{label: 'Points per $1', value: '3'}, {label: 'Birthday reward', value: '500 points'}, {label: 'Early access', value: 'true'}, {label: 'VIP support', value: 'true'}]},
          ],
          matrix: [{label: 'Points per $1'}, {label: 'Birthday reward'}, {label: 'Early access'}, {label: 'VIP support'}],
        }}
      />
      <RivoRewards cms={{container, heading: 'Redeem your points', section: {gridColumns: '3'}}} />
      <RivoPointsHistory cms={{container, heading: 'Points activity'}} />
      <RivoReferral cms={{container, heading: 'Refer a friend'}} />
    </div>
  );
}
