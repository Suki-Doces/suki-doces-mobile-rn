import { ContactCards } from '@/components/contact/ContactCards';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactHeading } from '@/components/contact/ContactHeading';
import { MessageHistoryCard } from '@/components/contact/MessageHistoryCard';
import { Screen } from '@/components/layout/Screen';
import { useContactForm } from '@/hooks/useContactForm';

export default function ContactScreen() {
  const {
    values,
    messages,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    setField,
    submit,
  } = useContactForm();

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ContactHeading />
      <ContactCards />
      <ContactForm
        values={values}
        error={error}
        successMessage={successMessage}
        isSubmitting={isSubmitting}
        setField={setField}
        submit={submit}
      />
      <MessageHistoryCard messages={messages} isLoading={isLoading} />
    </Screen>
  );
}