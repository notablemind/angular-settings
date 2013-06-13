
# angular-settings

  Settings manager for angular

## Installation

    $ component install notablemind/angular-settings

## API

### .factory(settingsmanager)

Setup the angular factory for the given settings manager. It will then be
available as the "settings" factory.

### Directive: settings
### Directive: setting
### Factory: settings -> 

### Default Types

#### keyboard-shortcut (soon to be "type what you want")
#### bool (rendered as a checkbox)
#### radio (rendered as radio buttons)

### Plugin API

#### register(type, plugin)

Plugin:

    {
      validate: function (value, setting) ->
         (null == valid | string == error message)
      template: str. This is rendered with the setting scope, with vbls
        - setting: {setting obj}
        - validate: fn
    }

Plugin components are *not* to register themselves. They are, by
convention, to expose this plugin object as the module.exports.


