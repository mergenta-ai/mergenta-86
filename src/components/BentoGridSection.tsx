import { useState } from 'react';
import { BentoCard } from './BentoCard';
import { bentoCards } from '@/config/bentoGridConfig';
import { SnapshotModal } from './modals/SnapshotModal';
import { POVLabModal } from './modals/POVLabModal';
import { PowerPlaybookModal } from './modals/PowerPlaybookModal';
import { FuturePathwaysModal } from './modals/FuturePathwaysModal';
import RealityCheckModal from './modals/RealityCheckModal';
import RoleplayHubModal from './modals/RoleplayHubModal';
import { ProtoRunModal } from './modals/ProtoRunModal';
import { ImageGenerationModal } from './modals/ImageGenerationModal';

interface BentoGridSectionProps {
  onAddToChat?: (message: string, response: string) => void;
  onPromptGenerated?: (prompt: string) => void;
}

export const BentoGridSection = ({ onAddToChat, onPromptGenerated }: BentoGridSectionProps) => {
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [povLabModalOpen, setPovLabModalOpen] = useState(false);
  const [powerPlaybookModalOpen, setPowerPlaybookModalOpen] = useState(false);
  const [futurePathwaysModalOpen, setFuturePathwaysModalOpen] = useState(false);
  const [realityCheckModalOpen, setRealityCheckModalOpen] = useState(false);
  const [roleplayHubModalOpen, setRoleplayHubModalOpen] = useState(false);
  const [protoRunModalOpen, setProtoRunModalOpen] = useState(false);
  const [imageGenModalOpen, setImageGenModalOpen] = useState(false);

  const handleModalOpen = (modalType: string) => {
    switch (modalType) {
      case 'snapshot':
        setSnapshotModalOpen(true);
        break;
      case 'pov-lab':
        setPovLabModalOpen(true);
        break;
      case 'power-playbook':
        setPowerPlaybookModalOpen(true);
        break;
      case 'future-pathways':
        setFuturePathwaysModalOpen(true);
        break;
      case 'reality-check':
        setRealityCheckModalOpen(true);
        break;
      case 'roleplay-hub':
        setRoleplayHubModalOpen(true);
        break;
      case 'proto-run':
        setProtoRunModalOpen(true);
        break;
      case 'image-gen':
        setImageGenModalOpen(true);
        break;
      default:
        console.log('Unknown modal type:', modalType);
    }
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bentoCards.map((card) => (
              <BentoCard
                key={card.id}
                {...card}
                onPromptGenerated={onPromptGenerated}
                onModalOpen={handleModalOpen}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SnapshotModal
        open={snapshotModalOpen}
        onOpenChange={setSnapshotModalOpen}
        onAddToChat={onAddToChat}
      />
      <POVLabModal
        open={povLabModalOpen}
        onOpenChange={setPovLabModalOpen}
        onAddToChat={onAddToChat}
      />
      <PowerPlaybookModal
        open={powerPlaybookModalOpen}
        onOpenChange={setPowerPlaybookModalOpen}
        onAddToChat={onAddToChat}
      />
      <FuturePathwaysModal
        open={futurePathwaysModalOpen}
        onOpenChange={setFuturePathwaysModalOpen}
        onAddToChat={onAddToChat}
      />
      <RealityCheckModal
        open={realityCheckModalOpen}
        onOpenChange={setRealityCheckModalOpen}
        onAddToChat={onAddToChat}
      />
      <RoleplayHubModal
        open={roleplayHubModalOpen}
        onOpenChange={setRoleplayHubModalOpen}
        onAddToChat={onAddToChat}
      />
      <ProtoRunModal
        open={protoRunModalOpen}
        onOpenChange={setProtoRunModalOpen}
        onAddToChat={onAddToChat}
      />
      <ImageGenerationModal
        isOpen={imageGenModalOpen}
        onClose={() => setImageGenModalOpen(false)}
      />
    </>
  );
};
