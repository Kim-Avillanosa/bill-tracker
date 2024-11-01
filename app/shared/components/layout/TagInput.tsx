import React, { useState } from "react";
import { InputGroup, FormControl, Badge, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa"; // Ensure you have react-icons installed

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      onChange(newTags);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleClearAllTags = () => {
    onChange([]); // Clear all tags
  };

  return (
    <div className="tag-input">
      <InputGroup>
        <FormControl
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press enter"
          aria-label="Tag input"
          className="rounded"
        />
        <Button
          variant="light"
          onClick={handleClearAllTags}
          className="ml-2"
          aria-label="Clear all tags"
        >
          Clear
        </Button>
      </InputGroup>
      <div className="mt-2 d-flex flex-wrap">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            className="m-1 d-flex align-items-center"
            bg="warning"
            text="dark"
          >
            {tag}
            <Button
              size="sm"
              variant="light"
              className="ml-1 p-0"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <FaTimes />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
