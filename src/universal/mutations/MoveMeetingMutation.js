import {commitMutation} from 'react-relay';
import actionMeeting from 'universal/modules/meeting/helpers/actionMeeting';

graphql`
  fragment MoveMeetingMutation_agendaItem on MoveMeetingPayload {
    completedAgendaItem {
      isComplete
    }
  }
`;

graphql`
  fragment MoveMeetingMutation_team on MoveMeetingPayload {
    team {
      facilitatorPhase
      facilitatorPhaseItem
      meetingPhase
      meetingPhaseItem
    }
  }
`;

const mutation = graphql`
  mutation MoveMeetingMutation($teamId: ID!, $nextPhase: ActionMeetingPhaseEnum, $nextPhaseItem: Int, $force: Boolean) {
    moveMeeting(teamId: $teamId, nextPhase: $nextPhase, nextPhaseItem: $nextPhaseItem, force: $force) {
      error {
        message
      }
      ...MoveMeetingMutation_agendaItem @relay(mask: false)
      ...MoveMeetingMutation_team @relay(mask: false)
    }
  }
`;

const MoveMeetingMutation = (environment, input, history, onError, onCompleted) => {
  const {teamId, nextPhase, nextPhaseItem, force} = input;
  return commitMutation(environment, {
    mutation,
    variables: {teamId, nextPhase, nextPhaseItem, force},
    optimisticUpdater: (store) => {
      const team = store.get(teamId);
      const safeItem = nextPhaseItem || '';
      const safePhase = nextPhase || team.getValue('facilitatorPhase');
      const currentMeetingPhase = team.getValue('meetingPhase');
      const currentMeetingPhaseItem = team.getValue('meetingPhaseItem');
      const nextPhaseInfo = actionMeeting[nextPhase];
      const meetingPhaseInfo = actionMeeting[currentMeetingPhase];
      if (nextPhase) {
        team.setValue(nextPhase, 'facilitatorPhase');
        if (nextPhaseInfo.index >= meetingPhaseInfo.index) {
          team.setValue(nextPhase, 'meetingPhase');
          if (nextPhaseItem && nextPhaseItem > currentMeetingPhaseItem) {
            team.setValue(nextPhaseItem, 'meetingPhaseItem');
          }
        }
      }
      if (nextPhaseItem) {
        team.setValue(nextPhaseItem, 'facilitatorPhaseItem');
        if (nextPhase === currentMeetingPhase && nextPhaseItem > currentMeetingPhaseItem) {
          team.setValue(nextPhaseItem, 'meetingPhaseItem');
        }
      }

      history.push(`/meeting/${teamId}/${safePhase}/${safeItem}`);
    },
    onCompleted,
    onError
  });
};

export default MoveMeetingMutation;
