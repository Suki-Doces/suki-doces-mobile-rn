import { StyleSheet } from 'react-native';

import { ContactCards } from '@/components/contact/ContactCards';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactHeading } from '@/components/contact/ContactHeading';
import { MessageHistoryCard } from '@/components/contact/MessageHistoryCard';
import { Footer } from '@/components/layout/Footer';
import { Screen } from '@/components/layout/Screen';

export default function ContactScreen() {
  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ContactHeading />
      <ContactCards />
      <ContactForm />
      <MessageHistoryCard />
      <Footer />
    </Screen>
  );
}