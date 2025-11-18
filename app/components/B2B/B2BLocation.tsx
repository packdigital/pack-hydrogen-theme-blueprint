import {useMenu} from '~/hooks';
import type {CustomerCompanyLocationConnection} from '~/lib/types';

import {useB2BLocationContext} from './useB2BLocationContext';
import {B2BLocationSelectorModal} from './B2BLocationSelectorModal';

export function B2BLocation() {
  const {company, companyLocationId} = useB2BLocationContext();
  const {openModal} = useMenu();

  const locations = company?.locations?.edges
    ? company.locations.edges.map(
        (location: CustomerCompanyLocationConnection) => {
          return {...location.node};
        },
      )
    : [];

  if (!company) return null;

  const locationFormattedAddress = locations.find(
    (companyLocation) => companyLocation.id == companyLocationId,
  )?.shippingAddress?.formattedAddress;

  const locationName = locations.find(
    (companyLocation) => companyLocation.id == companyLocationId,
  )?.name;

  return (
    <div className="order-3 grid grid-cols-1 gap-x-4 border-b border-border py-4 max-md:col-span-2 xs:grid-cols-2 md:order-2 md:grid-cols-1">
      <h3 className="mb-2 !text-base">
        <span className="font-normal">Logged in for:</span>
        <br />
        <span className="font-bold">{company.name}</span>
      </h3>

      <div>
        <p className="">Company Location:</p>
        <p className="font-bold">
          {locations.length
            ? locationFormattedAddress
              ? locationFormattedAddress.map((line) => <p key={line}>{line}</p>)
              : locations.length === 1
                ? 'No location'
                : 'Unselected'
            : 'No location'}
        </p>

        {locations.length > 1 && (
          <button
            onClick={() => openModal(<B2BLocationSelectorModal />)}
            type="button"
            className="mt-2 text-left underline"
          >
            {locationName ? 'Change' : 'Select'} Location
          </button>
        )}
      </div>
    </div>
  );
}
