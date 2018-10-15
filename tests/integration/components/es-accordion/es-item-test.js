import { find, click, focus, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { set, setProperties } from '@ember/object';

let statuses, status, title, availability, accordionItemIndex, accordionState;

module('Integration | Component | es accordion/es item', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(() => {
    statuses = [
      {
        status: 'shipped',
        label: 'Shipped',
        icon: 'fa-check-circle',
        color: 'success',
      },
    ];
    status = 'shipped';
    title = 'JavaScript Modules API';
    availability = null;
    accordionItemIndex = 1;
    accordionState = {
      activeItem: null,
      focusIndex: null,
      setActiveItem: sinon.spy(),
      registerIndex: sinon.spy(),
      setFocusIndex: sinon.spy(),
    };
  });

  hooks.afterEach(() => {
    statuses = status = title = availability = accordionItemIndex = accordionState = null;
  });

  test('it displays provided data', async function(assert) {
    setProperties(this, {
      availability,
      accordionItemIndex,
      accordionState,
      status,
      statuses,
      title,
    });
    
    await render(hbs`
      {{#es-accordion/es-item
        availability=availability
        title=title
        status=status
        statuses=statuses
        accordionItemIndex=accordionItemIndex
        accordionState=accordionState
      }}
        template block text
      {{/es-accordion/es-item}}
    `);

    assert.equal(find('.accordion-content').textContent.trim(), 'template block text');
    assert.equal(find('[data-role=title]').textContent.trim(), title);
    assert.equal(find('[data-role=availability]').textContent.trim(), 'Avail: Not yet available');
    assert.equal(find('[data-role=status]').textContent.trim(), statuses[0].label);

    await set(this, 'availability', 'Some availability');

    await render(hbs`
      {{#es-accordion/es-item
        availability=availability
        title=title
        status=status
        statuses=statuses
        accordionItemIndex=accordionItemIndex
        accordionState=accordionState
      }}
        template block text
      {{/es-accordion/es-item}}
    `);

    assert.equal(find('[data-role=availability]').textContent.trim(), 'Avail: Some availability');
  });

  test('it correctly handles user inputs', async function(assert) {
    setProperties(this, {
      availability,
      accordionItemIndex,
      accordionState,
      status,
      statuses,
      title,
    });

    await render(hbs`
      {{#es-accordion/es-item
        availability=availability
        title=title
        status=status
        statuses=statuses
        accordionItemIndex=accordionItemIndex
        accordionState=accordionState
      }}
        template block text
      {{/es-accordion/es-item}}
    `);

    assert.ok(accordionState.registerIndex.calledOnce, 'registerIndex called');

    await click('.accordion-heading');
    assert.ok(accordionState.setActiveItem.calledOnce, 'setActiveItem called');

    await focus('.button-icon');

    assert.ok(accordionState.setFocusIndex.calledOnce, 'setFocusIndex called');
    assert.ok(find('.accordion-body.collapse'), 'accordion item is collapsed');

    set(this, 'accordionState.activeItem', 1);

    await render(hbs`
      {{#es-accordion/es-item
        availability=availability
        title=title
        status=status
        statuses=statuses
        accordionItemIndex=accordionItemIndex
        accordionState=accordionState
      }}
        template block text
      {{/es-accordion/es-item}}
    `);

    assert.notOk(find('.accordion-content.collapse'), 'accordion item is expanded');
  });
});
