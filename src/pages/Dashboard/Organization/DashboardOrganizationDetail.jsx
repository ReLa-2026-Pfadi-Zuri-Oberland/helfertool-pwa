import {
  removeOrganization,
  updateOrganization,
  useFireBaseOrganizations,
} from '../../../firebase/useFireBaseOrganizations';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../components/Button/Button';
import DomainIcon from '@mui/icons-material/Domain';
import GenericInput from '../../../components/GenericInput';
import WhiteCard from '../../../components/WhiteCard';
import { useNavigate } from 'react-router-dom';

const DashboardOrganizationDetail = () => {
  let navigate = useNavigate();
  const [organizations, loading, error] = useFireBaseOrganizations();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  // Filter for organization with id from URL
  const organizationId = window.location.pathname.split('/').pop();
  const organization = organizations.find((org) => org.id === organizationId);

  if (!organization)
    return (
      <WhiteCard>
        <h3>Organization with id "{organizationId}" not found</h3>
      </WhiteCard>
    );

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/organizations');
          }}
        />
        <DomainIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>{organization.name}</h2>
        </div>
      </div>
      <GenericInput
        kind='text'
        displayName='Name'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { name: newValue })
        }
        initialValue={organization.name}
      />
      <GenericInput
        kind='text'
        displayName='Strasse'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { street: newValue })
        }
        initialValue={organization.street}
      />
      <GenericInput
        kind='text'
        displayName='Stadt'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { city: newValue })
        }
        initialValue={organization.city}
      />
      <GenericInput
        kind='text'
        displayName='Land'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { country: newValue })
        }
        initialValue={organization.country}
      />
      <GenericInput
        kind='text'
        displayName='Website'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { website: newValue })
        }
        initialValue={organization.website}
      />
      <GenericInput
        kind='text'
        displayName='Kontakt Name'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { contactName: newValue })
        }
        initialValue={organization.contactName}
      />
      <GenericInput
        kind='email'
        displayName='Kontakt Email'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { contactEmail: newValue })
        }
        initialValue={organization.contactEmail}
      />
      <GenericInput
        kind='phone'
        displayName='Kontakt Telefon'
        updateFunction={(newValue) =>
          updateOrganization(organization.id, { contactPhone: newValue })
        }
        initialValue={organization.contactPhone}
      />
      <Button
        onClick={() => {
          removeOrganization(organization.id);
          navigate('/dashboard/organizations');
        }}
      >
        ENTFERNE ORGANISATION
      </Button>
    </WhiteCard>
  );
};

export default DashboardOrganizationDetail;
