import { StartCommunityContent } from "../components/StartCommunityContent";

export function Community() {
  return (
    <div className="w-full md:p-4 grid grid-cols-1 gap-4">
      <div>
        <StartCommunityContent />
      </div>
    </div>
  );
}
