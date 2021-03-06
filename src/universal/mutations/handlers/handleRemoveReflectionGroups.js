import pluralizeHandler from 'universal/mutations/handlers/pluralizeHandler';
import safeRemoveNodeFromArray from 'universal/utils/relay/safeRemoveNodeFromArray';

const handleRemoveReflectionGroup = (reflectionGroupId, meetingId, store) => {
  const reflectionGroup = store.get(reflectionGroupId);
  if (!reflectionGroup) return;
  const meeting = store.get(meetingId);
  if (!meeting) return;
  safeRemoveNodeFromArray(reflectionGroupId, meeting, 'reflectionGroups');
};

const handleRemoveReflectionGroups = pluralizeHandler(handleRemoveReflectionGroup);
export default handleRemoveReflectionGroups;
