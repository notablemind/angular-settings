
# angular-settings

  Settings manager for angular

## Installation

    $ component install notablemind/angular-settings

## Todo

### Figure out localization

I want to do it ... but I'm not yet sure of the method.

### Make a bootstrap theme

Maybe use angular-ui? Honestly, I'm a little wary of depending on large
projects like that, though. This should be small and modular.

### Figure out the plugin situation better

Currently logic + presentation are together.

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


