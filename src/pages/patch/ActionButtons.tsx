import React, { useRef, useState, useEffect } from "react";
import { Button } from "components/Button";
import { useParams } from "react-router-dom";
import { PageButtonRow } from "components/styles";
import { ButtonDropdown } from "components/ButtonDropdown";
import {
  SchedulePatchTasks,
  RestartPatch,
  UnschedulePatchTasks,
  SetPatchPriority,
} from "components/PatchActionButtons";

export const ActionButtons = () => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { id: patchId } = useParams<{ id: string }>();

  const [isActionLoading, setIsActionLoading] = useState(false);

  const hideMenu = () => setIsVisible(false);

  useEffect(() => {
    if (isActionLoading) {
      setIsVisible(false);
    }
  }, [isActionLoading, setIsVisible]);

  const dropdownItems = [
    <UnschedulePatchTasks
      {...{
        patchId,
        hideMenu,
        refetchQueries,
        key: "unschedule",
        setParentLoading: setIsActionLoading,
        disabled: isActionLoading,
      }}
    />,
    <SetPatchPriority
      {...{
        patchId,
        hideMenu,
        key: "priority",
        disabled: isActionLoading,
        refetchQueries,
        setParentLoading: setIsActionLoading,
      }}
    />,
  ];

  return (
    <>
      <PageButtonRow ref={wrapperRef}>
        <SchedulePatchTasks
          {...{
            patchId,
            hideMenu,
            isButton: true,
            disabled: isActionLoading,
            setParentLoading: setIsActionLoading,
            refetchQueries,
          }}
        />
        <RestartPatch
          {...{
            patchId,
            hideMenu,
            isButton: true,
            disabled: isActionLoading,
            refetchQueries,
          }}
        />
        <Button
          size="small"
          dataCy="notify-patch"
          key="notifications"
          disabled={isActionLoading}
        >
          Notify Me
        </Button>
        <ButtonDropdown
          disabled={isActionLoading}
          dropdownItems={dropdownItems}
          isVisibleDropdown={isVisible}
          setIsVisibleDropdown={setIsVisible}
          loading={false}
        />
      </PageButtonRow>
    </>
  );
};

const refetchQueries = ["Patch"];