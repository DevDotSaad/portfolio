import { Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import Featured from '@/components/sections/Featured';
import MoreProjects from '@/components/sections/MoreProjects';
import Stack from '@/components/sections/Stack';
import Concepts from '@/components/sections/Concepts';
import { Education, Experience, HowIWork } from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

// Each section sits in its own Suspense boundary so React hydrates the page in
// several short tasks instead of one long one (keeps Total Blocking Time low).
const sections = [Hero, Featured, MoreProjects, Stack, Concepts, HowIWork, Experience, Education, Contact];

export default function Home() {
  return (
    <>
      <main id="main">
        {sections.map((Section, i) => (
          <Suspense key={i} fallback={null}>
            <Section />
          </Suspense>
        ))}
      </main>
      <Footer />
    </>
  );
}
