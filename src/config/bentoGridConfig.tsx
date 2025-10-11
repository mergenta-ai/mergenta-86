import { Pen, FileText, Brain, Search, Target, Zap, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

// Import all hover cards
import EssayHoverCard from '@/components/hover-cards/EssayHoverCard';
import StoryHoverCard from '@/components/hover-cards/StoryHoverCard';
import FlashFictionHoverCard from '@/components/hover-cards/FlashFictionHoverCard';
import ScriptHoverCard from '@/components/hover-cards/ScriptHoverCard';
import BlogHoverCard from '@/components/hover-cards/BlogHoverCard';
import PoetryHoverCard from '@/components/hover-cards/PoetryHoverCard';
import SpeechHoverCard from '@/components/hover-cards/SpeechHoverCard';
import BrainstormHoverCard from '@/components/hover-cards/BrainstormHoverCard';
import ScenarioHoverCard from '@/components/hover-cards/ScenarioHoverCard';
import MentorHoverCard from '@/components/hover-cards/MentorHoverCard';
import DevilsAdvocateHoverCard from '@/components/hover-cards/DevilsAdvocateHoverCard';
import AstroLensHoverCard from '@/components/hover-cards/AstroLensHoverCard';
import LoveLetterHoverCard from '@/components/hover-cards/LoveLetterHoverCard';
import ApologyLetterHoverCard from '@/components/hover-cards/ApologyLetterHoverCard';
import ThankYouLetterHoverCard from '@/components/hover-cards/ThankYouLetterHoverCard';
import CondolenceLetterHoverCard from '@/components/hover-cards/CondolenceLetterHoverCard';
import InvitationLetterHoverCard from '@/components/hover-cards/InvitationLetterHoverCard';
import CongratulatoryLetterHoverCard from '@/components/hover-cards/CongratulatoryLetterHoverCard';
import WelcomeLetterHoverCard from '@/components/hover-cards/WelcomeLetterHoverCard';
import FarewellLetterHoverCard from '@/components/hover-cards/FarewellLetterHoverCard';
import ComplaintLetterHoverCard from '@/components/hover-cards/ComplaintLetterHoverCard';
import RecommendationLetterHoverCard from '@/components/hover-cards/RecommendationLetterHoverCard';
import RequestLetterHoverCard from '@/components/hover-cards/RequestLetterHoverCard';
import GeneralLetterHoverCard from '@/components/hover-cards/GeneralLetterHoverCard';
import LeaveApplicationHoverCard from '@/components/hover-cards/LeaveApplicationHoverCard';
import PermissionLetterHoverCard from '@/components/hover-cards/PermissionLetterHoverCard';
import AppreciationLetterHoverCard from '@/components/hover-cards/AppreciationLetterHoverCard';
import AppointmentRequestHoverCard from '@/components/hover-cards/AppointmentRequestHoverCard';
import PublicationRequestHoverCard from '@/components/hover-cards/PublicationRequestHoverCard';

export interface BentoCardItem {
  text: string;
  tooltip?: string;
  component?: (onPromptGenerated?: (prompt: string) => void) => React.ReactNode;
  subItems?: BentoCardItem[];
  modalType?: string;
}

export interface BentoCard {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  items?: BentoCardItem[];
  onClick?: () => void;
  modalType?: 'snapshot' | 'pov-lab' | 'power-playbook' | 'future-pathways' | 'reality-check' | 'roleplay-hub' | 'proto-run' | 'image-gen';
}

export const bentoCards: BentoCard[] = [
  {
    id: 'beautiful-writing',
    title: 'Beautiful Writing',
    subtitle: 'Essays, stories & poetry',
    icon: Pen,
    gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-400',
    items: [
      {
        text: 'Essay',
        tooltip: 'Structured, formal writing',
        component: (onPromptGenerated) => (
          <EssayHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Essay</span>
            </button>
          </EssayHoverCard>
        ),
      },
      {
        text: 'Story',
        component: (onPromptGenerated) => (
          <StoryHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Story</span>
            </button>
          </StoryHoverCard>
        ),
      },
      {
        text: 'Flash Fiction',
        component: (onPromptGenerated) => (
          <FlashFictionHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Flash Fiction</span>
            </button>
          </FlashFictionHoverCard>
        ),
      },
      {
        text: 'Script',
        component: (onPromptGenerated) => (
          <ScriptHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Script</span>
            </button>
          </ScriptHoverCard>
        ),
      },
      {
        text: 'Blog',
        component: (onPromptGenerated) => (
          <BlogHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Blog</span>
            </button>
          </BlogHoverCard>
        ),
      },
      {
        text: 'Poetry',
        component: (onPromptGenerated) => (
          <PoetryHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Poetry</span>
            </button>
          </PoetryHoverCard>
        ),
      },
      {
        text: 'Speech',
        component: (onPromptGenerated) => (
          <SpeechHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Speech</span>
            </button>
          </SpeechHoverCard>
        ),
      },
    ],
  },
  {
    id: 'easy-draft',
    title: 'Easy Draft',
    subtitle: 'Letters & documents',
    icon: FileText,
    gradient: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400',
    items: [
      {
        text: 'Personal Letters',
        subItems: [
          {
            text: 'Love letter',
            component: (onPromptGenerated) => (
              <LoveLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Love letter</span>
                </button>
              </LoveLetterHoverCard>
            ),
          },
          {
            text: 'Apology letter',
            component: (onPromptGenerated) => (
              <ApologyLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Apology letter</span>
                </button>
              </ApologyLetterHoverCard>
            ),
          },
          {
            text: 'Thank you letter',
            component: (onPromptGenerated) => (
              <ThankYouLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Thank you letter</span>
                </button>
              </ThankYouLetterHoverCard>
            ),
          },
          {
            text: 'Condolence letter',
            component: (onPromptGenerated) => (
              <CondolenceLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Condolence letter</span>
                </button>
              </CondolenceLetterHoverCard>
            ),
          },
        ],
      },
      {
        text: 'Social Letters',
        subItems: [
          {
            text: 'Invitation letter',
            component: (onPromptGenerated) => (
              <InvitationLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Invitation letter</span>
                </button>
              </InvitationLetterHoverCard>
            ),
          },
          {
            text: 'Congratulatory letter',
            component: (onPromptGenerated) => (
              <CongratulatoryLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Congratulatory letter</span>
                </button>
              </CongratulatoryLetterHoverCard>
            ),
          },
          {
            text: 'Welcome letter',
            component: (onPromptGenerated) => (
              <WelcomeLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Welcome letter</span>
                </button>
              </WelcomeLetterHoverCard>
            ),
          },
          {
            text: 'Farewell letter',
            component: (onPromptGenerated) => (
              <FarewellLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Farewell letter</span>
                </button>
              </FarewellLetterHoverCard>
            ),
          },
        ],
      },
      {
        text: 'Institutional Letters',
        subItems: [
          {
            text: 'Leave application',
            component: (onPromptGenerated) => (
              <LeaveApplicationHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Leave application</span>
                </button>
              </LeaveApplicationHoverCard>
            ),
          },
          {
            text: 'Permission letter',
            component: (onPromptGenerated) => (
              <PermissionLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Permission letter</span>
                </button>
              </PermissionLetterHoverCard>
            ),
          },
          {
            text: 'Appreciation letter',
            component: (onPromptGenerated) => (
              <AppreciationLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Appreciation letter</span>
                </button>
              </AppreciationLetterHoverCard>
            ),
          },
          {
            text: 'Appointment request letter',
            component: (onPromptGenerated) => (
              <AppointmentRequestHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Appointment request letter</span>
                </button>
              </AppointmentRequestHoverCard>
            ),
          },
          {
            text: 'Publication request letter',
            component: (onPromptGenerated) => (
              <PublicationRequestHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Publication request letter</span>
                </button>
              </PublicationRequestHoverCard>
            ),
          },
        ],
      },
      {
        text: 'Formal Letters',
        subItems: [
          {
            text: 'Complaint letter',
            component: (onPromptGenerated) => (
              <ComplaintLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Complaint letter</span>
                </button>
              </ComplaintLetterHoverCard>
            ),
          },
          {
            text: 'Recommendation letter',
            component: (onPromptGenerated) => (
              <RecommendationLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Recommendation letter</span>
                </button>
              </RecommendationLetterHoverCard>
            ),
          },
          {
            text: 'Request letter',
            component: (onPromptGenerated) => (
              <RequestLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>Request letter</span>
                </button>
              </RequestLetterHoverCard>
            ),
          },
          {
            text: 'General letter',
            component: (onPromptGenerated) => (
              <GeneralLetterHoverCard onPromptGenerated={onPromptGenerated}>
                <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
                  <span>General letter</span>
                </button>
              </GeneralLetterHoverCard>
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'think-hard',
    title: 'Think Hard',
    subtitle: 'Deep reasoning mode',
    icon: Brain,
    gradient: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
    onClick: () => {
      // Direct action - could trigger a mode change
      console.log('Think Hard mode activated');
    },
  },
  {
    id: 'deep-research',
    title: 'Deep Research',
    subtitle: 'Comprehensive analysis',
    icon: Search,
    gradient: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500',
    onClick: () => {
      console.log('Deep Research mode activated');
    },
  },
  {
    id: 'task-assistant',
    title: 'Task Assistant',
    subtitle: 'Planning & analysis',
    icon: Target,
    gradient: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400',
    items: [
      {
        text: 'Brainstorm with me',
        component: (onPromptGenerated) => (
          <BrainstormHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Brainstorm with me</span>
            </button>
          </BrainstormHoverCard>
        ),
      },
      {
        text: 'Scenario Planning',
        component: (onPromptGenerated) => (
          <ScenarioHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Scenario Planning</span>
            </button>
          </ScenarioHoverCard>
        ),
      },
      {
        text: 'Think like a mentor',
        component: (onPromptGenerated) => (
          <MentorHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Think like a mentor</span>
            </button>
          </MentorHoverCard>
        ),
      },
      {
        text: "Be a devil's advocate",
        component: (onPromptGenerated) => (
          <DevilsAdvocateHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Be a devil's advocate</span>
            </button>
          </DevilsAdvocateHoverCard>
        ),
      },
      {
        text: 'Astro Lens',
        component: (onPromptGenerated) => (
          <AstroLensHoverCard onPromptGenerated={onPromptGenerated}>
            <button className="w-full text-left px-6 py-4 rounded-xl bg-white hover:bg-purple-50 border border-purple-100 transition-colors duration-200 min-h-[60px] flex items-center justify-between text-base font-medium text-gray-700 hover:text-purple-600">
              <span>Astro Lens</span>
            </button>
          </AstroLensHoverCard>
        ),
      },
    ],
  },
  {
    id: 'power-playbook',
    title: 'Power Playbook',
    subtitle: 'Strategic decision tools',
    icon: Zap,
    gradient: 'bg-gradient-to-br from-red-600 via-rose-600 to-pink-600',
    modalType: 'power-playbook',
  },
  {
    id: 'experience-studio',
    title: 'Experience Studio',
    subtitle: 'Interactive simulations',
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600',
    items: [
      { text: 'Proto Run', modalType: 'proto-run' as const },
      { text: '360° Snapshot', modalType: 'snapshot' as const },
      { text: 'POV Lab', modalType: 'pov-lab' as const },
      { text: 'Future Pathways', modalType: 'future-pathways' as const },
      { text: 'Roleplay Hub', modalType: 'roleplay-hub' as const },
      { text: 'Reality Check', modalType: 'reality-check' as const },
    ],
  },
];
