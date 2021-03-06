/* eslint-disable prefer-destructuring */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { feathersClient } from '../../lib/feathersClient';
import GoBackButton from '../GoBackButton';
import Loader from '../Loader';
import { history } from '../../lib/helpers';

import ProfileMilestonesTable from '../ProfileMilestonesTable';
import ProfileCampaignsTable from '../ProfileCampaignsTable';
import ProfileDacsTable from '../ProfileDacsTable';
import ProfileDonationsTable from '../ProfileDonationsTable';
import ProfileUserInfo from '../ProfileUserInfo';
import ProfileUpdatePermission from '../ProfileUpdatePermission';
import { User } from '../../models';

/**
 * The user profile view mapped to /profile/{userAddress}
 */
const Profile = props => {
  const { userAddress } = props.match.params;
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    feathersClient
      .service('users')
      .find({ query: { address: userAddress, $limit: 1 } })
      .then(resp => {
        const _user = resp.data[0];
        setUser(new User(_user));
        setLoading(false);
        setHasError(false);
      })
      .catch(() => {
        setLoading(false);
        setHasError(true);
      });
  }, []);

  return (
    <div id="profile-view">
      <div className="container-fluid page-layout dashboard-table-view">
        <div className="row">
          <div className="col-md-8 m-auto">
            {isLoading && <Loader className="fixed" />}

            {!isLoading && !hasError && (
              <div>
                <GoBackButton history={history} goPreviousPage />

                <ProfileUserInfo user={user} />

                <ProfileUpdatePermission user={user} />
              </div>
            )}

            <ProfileMilestonesTable userAddress={userAddress} />

            <ProfileCampaignsTable userAddress={userAddress} />

            <ProfileDacsTable userAddress={userAddress} />

            <ProfileDonationsTable userAddress={userAddress} />
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userAddress: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Profile;
