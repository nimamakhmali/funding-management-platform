"""
تست State Machine پروژه
"""
import pytest
from apps.projects.domain.state_machine import (
    ProjectStatus,
    validate_transition,
)
from shared.exceptions import InvalidStateTransition


def test_valid_transition():
    # PENDING_REVIEW → APPROVED
    validate_transition(ProjectStatus.PENDING_REVIEW, ProjectStatus.APPROVED)


def test_invalid_transition():
    with pytest.raises(InvalidStateTransition):
        validate_transition(ProjectStatus.DRAFT, ProjectStatus.COMPLETED)


def test_terminal_states_no_transition():
    with pytest.raises(InvalidStateTransition):
        validate_transition(ProjectStatus.COMPLETED, ProjectStatus.FUNDING)