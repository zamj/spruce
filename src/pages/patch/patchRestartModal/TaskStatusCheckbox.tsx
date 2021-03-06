import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { mapVariantTaskStatusToColor, Square } from "components/StatusSquare";
import { PatchBuildVariantTask } from "gql/generated/types";
import { selectedStrings } from "hooks/usePatchStatusSelect";

interface TaskStatusCheckboxProps {
  task: PatchBuildVariantTask;
  selectedTasks: selectedStrings;
  toggleSelectedTask: (id: string) => void;
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  task,
  selectedTasks,
  toggleSelectedTask,
}) => (
  <Checkbox
    data-cy="task-status-checkbox"
    onChange={() => toggleSelectedTask(task.id)}
    label={
      <StateItemWrapper>
        <PaddedSquare color={mapVariantTaskStatusToColor[task.status]} />{" "}
        {task.name}
      </StateItemWrapper>
    }
    checked={selectedTasks[task.id]}
    bold={false}
  />
);

export const TaskStatusCheckbox = React.memo(CheckboxComponent);

const PaddedSquare = styled(Square)`
  margin-right: 6px;
`;

const StateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
