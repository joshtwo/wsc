/**
 * Navigation UI element. Provides helpers for controlling the chat navigation.
 *
 * @class Navigation
 * @constructor
 * @param ui {Object} Chatterbox.UI object.
 */
Chatterbox.Navigation = function( ui ) {

    this.manager = ui;
    this.nav = this.manager.view.find('nav.tabs');
    this.tabs = this.nav.find('#chattabs');
    this.buttons = this.nav.find('#tabnav');
    this.tableft = this.buttons.find('.arrow_left');
    this.tabright = this.buttons.find('.arrow_right');
    this.settingsb = this.buttons.find('#settings-button');
    this.settings = {};
    this.settings.open = false;
    this.showclose = true;
    
    var nav = this;
    this.settingsb.click(
        function( event ) {
            if( nav.settings.open )
                return false;
            
            var evt = {
                'e': event,
                'settings': new Chatterbox.Settings.Config()
            };
            
            nav.manager.trigger('settings.open', evt);
            nav.manager.trigger('settings.open.ran', evt);
            
            var about = evt.settings.page('About', true);
            about.item('text', {
                'ref': 'about-chatterbox',
                'wclass': 'centered faint',
                'text': 'Using <a href="http://github.com/photofroggy/wsc/">Chatterbox</a> version ' + Chatterbox.VERSION + ' ' + Chatterbox.STATE + ' by ~<a href="http://photofroggy.deviantart.com/">photofroggy</a>.'
            });
            
            nav.settings.window = new Chatterbox.Settings( nav.manager, evt.settings );
            nav.settings.window.build();
            nav.settings.open = true;
            return false;
        }
    );
    
    this.tableft.click(
        function(  ) {
            nav.manager.channel_left();
            return false;
        }
    );
    
    this.tabright.click(
        function(  ) {
            nav.manager.channel_right();
            return false;
        }
    );

};

/**
 * Get the height of the navigation bar.
 *
 * @method height
 * @return {Integer} The height of the navigation bar in pixels.
 */
Chatterbox.Navigation.prototype.height = function(  ) {
    return this.nav.height();
};

/**
 * Add a channel tab to the navigation bar.
 * 
 * @method add_tab
 * @param selector {String} Shorthand lower case name for the channel with no prefixes.
 * @param ns {String} Shorthand namespace for the channel. Used as the label
 *   for the tab.
 */
Chatterbox.Navigation.prototype.add_tab = function( selector, ns ) {
    this.tabs.append(Chatterbox.render('tab', {'selector': selector, 'ns': ns}));
    return this.tabs.find('#' + selector + '-tab');
};

/**
 * Resize the tab bar.
 * 
 * @method resize
 */
Chatterbox.Navigation.prototype.resize = function(  ) {

    this.tabs.width( this.nav.width() - this.buttons.outerWidth() - 20 );
    if( this.settings.open ) {
        this.settings.window.resize();
    }

};

/**
 * Set or get the visibility of tab close buttons.
 * 
 * @method closer
 * @param [visible] {Boolean} Should the close buttons be shown?
 * @return {Boolean} Whether or not the close buttons are visible.
 */
Chatterbox.Navigation.prototype.closer = function( visible ) {

    if( visible == undefined || visible == this.showclose )
        return this.showclose;
    
    this.showclose = visible;
    if( this.showclose ) {
        if( !this.tabs.hasClass('hc') )
            return;
        this.tabs.removeClass('hc');
        return;
    }
    
    if( this.tabs.hasClass('hc') )
        return;
    this.tabs.addClass('hc');

};


