import {Component, Fragment} from 'react';

import Panel from 'sentry/components/panels/panel';
import PanelBody from 'sentry/components/panels/panelBody';
import type {Organization} from 'sentry/types/organization';
import type {Project} from 'sentry/types/project';
import removeAtArrayIndex from 'sentry/utils/array/removeAtArrayIndex';
import replaceAtArrayIndex from 'sentry/utils/array/replaceAtArrayIndex';
import ActionsPanel from 'sentry/views/alerts/rules/metric/triggers/actionsPanel';
import TriggerForm from 'sentry/views/alerts/rules/metric/triggers/form';

import {
  type Action,
  AlertRuleComparisonType,
  type AlertRuleThresholdType,
  type MetricActionTemplate,
  type Trigger,
  type UnsavedMetricRule,
} from '../types';

type Props = {
  aggregate: UnsavedMetricRule['aggregate'];
  availableActions: MetricActionTemplate[] | null;
  comparisonType: AlertRuleComparisonType;
  currentProject: string;
  disabled: boolean;
  errors: Map<number, {[fieldName: string]: string}>;
  onChange: (
    triggers: Trigger[],
    triggerIndex?: number,
    changeObj?: Partial<Trigger>
  ) => void;
  onResolveThresholdChange: (
    resolveThreshold: UnsavedMetricRule['resolveThreshold']
  ) => void;
  onThresholdPeriodChange: (value: number) => void;
  onThresholdTypeChange: (thresholdType: AlertRuleThresholdType) => void;
  organization: Organization;
  projects: Project[];
  resolveThreshold: UnsavedMetricRule['resolveThreshold'];

  thresholdPeriod: UnsavedMetricRule['thresholdPeriod'];

  thresholdType: UnsavedMetricRule['thresholdType'];
  triggers: Trigger[];
  isMigration?: boolean;
};

/**
 * A list of forms to add, edit, and delete triggers.
 */
class Triggers extends Component<Props> {
  handleDeleteTrigger = (index: number) => {
    const {triggers, onChange} = this.props;
    const updatedTriggers = removeAtArrayIndex(triggers, index);

    onChange(updatedTriggers);
  };

  handleChangeTrigger = (
    triggerIndex: number,
    trigger: Trigger,
    changeObj: Partial<Trigger>
  ) => {
    const {triggers, onChange} = this.props;
    const updatedTriggers = replaceAtArrayIndex(triggers, triggerIndex, trigger);
    onChange(updatedTriggers, triggerIndex, changeObj);
  };

  handleAddAction = (triggerIndex: number, action: Action) => {
    const {onChange, triggers} = this.props;
    const trigger = triggers[triggerIndex];
    const actions = [...trigger.actions, action];
    const updatedTriggers = replaceAtArrayIndex(triggers, triggerIndex, {
      ...trigger,
      actions,
    });
    onChange(updatedTriggers, triggerIndex, {actions});
  };

  handleChangeActions = (
    triggerIndex: number,
    triggers: Trigger[],
    actions: Action[]
  ): void => {
    const {onChange} = this.props;
    const trigger = triggers[triggerIndex];
    const updatedTriggers = replaceAtArrayIndex(triggers, triggerIndex, {
      ...trigger,
      actions,
    });
    onChange(updatedTriggers, triggerIndex, {actions});
  };

  render() {
    const {
      availableActions,
      currentProject,
      errors,
      organization,
      projects,
      triggers,
      disabled,
      aggregate,
      thresholdType,
      thresholdPeriod,
      comparisonType,
      resolveThreshold,
      isMigration,
      onThresholdTypeChange,
      onResolveThresholdChange,
      onThresholdPeriodChange,
    } = this.props;

    // Note we only support 2 triggers max
    return (
      <Fragment>
        <Panel>
          <PanelBody>
            {comparisonType === AlertRuleComparisonType.DYNAMIC ? (
              <div>{'This is where the anomaly detection alert field choices go'}</div>
            ) : (
              <TriggerForm
                disabled={disabled}
                errors={errors}
                organization={organization}
                projects={projects}
                triggers={triggers}
                aggregate={aggregate}
                resolveThreshold={resolveThreshold}
                thresholdType={thresholdType}
                thresholdPeriod={thresholdPeriod}
                comparisonType={comparisonType}
                onChange={this.handleChangeTrigger}
                onThresholdTypeChange={onThresholdTypeChange}
                onResolveThresholdChange={onResolveThresholdChange}
                onThresholdPeriodChange={onThresholdPeriodChange}
              />
            )}
          </PanelBody>
        </Panel>

        {isMigration ? null : (
          <ActionsPanel
            disabled={disabled}
            loading={availableActions === null}
            error={false}
            availableActions={availableActions}
            currentProject={currentProject}
            organization={organization}
            projects={projects}
            triggers={triggers}
            onChange={this.handleChangeActions}
            onAdd={this.handleAddAction}
          />
        )}
      </Fragment>
    );
  }
}

export default Triggers;
