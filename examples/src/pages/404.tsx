import { FormattedMessage } from 'react-intl';
import { DefaultLayout } from '../layouts/DefaultLayout';

export default function NotFound() {
  return (
    <DefaultLayout>
      404
      <FormattedMessage id="language" />
    </DefaultLayout>
  );
}
