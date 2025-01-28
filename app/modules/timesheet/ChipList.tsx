import React from "react";
import { Badge } from "react-bootstrap";

interface ChipsListProps {
  chips: string[]; // Array of chip text values
  selectedChips: string[]; // Currently selected chips
  onChipClick: (chip: string) => void; // Callback when a chip is clicked
  onChipUnclick: (chip: string) => void; // Callback when a chip is unclicked
}

const ChipsList: React.FC<ChipsListProps> = ({
  chips,
  selectedChips,
  onChipClick,
  onChipUnclick,
}) => {
  const handleChipClick = (chip: string) => {
    const isSelected = selectedChips.includes(chip);

    if (isSelected) {
      // If chip is already selected, trigger onChipUnclick
      onChipUnclick(chip);
    } else {
      // If chip is not selected, trigger onChipClick
      onChipClick(chip);
    }
  };

  return (
    <div className="d-flex flex-wrap gap-2 my-3">
      {chips.map((chip, index) => (
        <Badge
          className="p-2"
          key={index}
          bg={selectedChips.includes(chip) ? "primary" : "dark"} // Toggle color
          style={{ cursor: "pointer" }}
          onClick={() => handleChipClick(chip)}
        >
          {chip} {selectedChips.includes(chip) && "✅"}
        </Badge>
      ))}
    </div>
  );
};

export default ChipsList;
