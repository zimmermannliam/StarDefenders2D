
import sdRenderer from './sdRenderer.js';
import sdWorld from '../sdWorld.js';
import sdShop from './sdShop.js';
import sdCom from '../entities/sdCom.js';

class sdContextMenu
{
	static init_class()
	{
		sdContextMenu.open = false;
		sdContextMenu.options = [];
		sdContextMenu.x = 0;
		sdContextMenu.y = 0;
		
		sdContextMenu.current_target = null;
		sdContextMenu.potential_option = null;
	}
	static Open()
	{
		if ( sdWorld.hovered_entity )
		{
			sdContextMenu.current_target = sdWorld.hovered_entity;
			
			if ( sdContextMenu.current_target === sdWorld.my_entity )
			{
				sdContextMenu.options = [];
				
				sdContextMenu.options.push({ title: 'Extract from location',
					action: ()=>
					{
						//globalThis.socket.emit( 'SELF_EXTRACT' );
						sdWorld.Stop();
					}
				});
			}
			else
			{
				sdContextMenu.options = [];
				
				if ( sdContextMenu.current_target.GetClass() === 'sdCharacter' )
				{
					if ( sdContextMenu.current_target.hea > 0 )
					{
					}
				}
				else
				if ( sdContextMenu.current_target.GetClass() === 'sdCom' )
				{
					if ( sdWorld.inDist2D( sdWorld.my_entity.x, sdWorld.my_entity.y, sdContextMenu.current_target.x, sdContextMenu.current_target.y, sdCom.action_range ) >= 0 )
					{
						if ( sdContextMenu.current_target.subscribers.indexOf( sdWorld.my_entity._net_id ) === -1 )
						sdContextMenu.options.push({ title: 'Subscribe to network',
							action: ()=>
							{
								globalThis.socket.emit( 'COM_SUB', sdContextMenu.current_target._net_id );
							}
						});
						
						for ( var i = 0; i < sdContextMenu.current_target.subscribers.length; i++ )
						{
							let net_id = sdContextMenu.current_target.subscribers[ i ];
							sdContextMenu.options.push({ title: 'Kick user ' + net_id,
								action: ()=>
								{
									globalThis.socket.emit( 'COM_KICK', [ sdContextMenu.current_target._net_id, net_id ] );
								}
							});
						}
					}
					if ( sdContextMenu.current_target.subscribers.indexOf( sdWorld.my_entity._net_id ) !== -1 )
					sdContextMenu.options.push({ title: 'Unsubscribe from network',
						action: ()=>
						{
							globalThis.socket.emit( 'COM_UNSUB', sdContextMenu.current_target._net_id );
						}
					});
				}
			}
			
			if ( sdContextMenu.options.length > 0 )
			{
				sdContextMenu.open = true;
				sdContextMenu.x = sdWorld.mouse_screen_x;
				sdContextMenu.y = sdWorld.mouse_screen_y;

				sdRenderer.UpdateCursor();
			}
		}
	}
	static MouseDown( e )
	{
		if ( !sdContextMenu.open )
		{
			if ( !sdShop.open )
			if ( e.which === 3 )
			if ( ( !sdContextMenu.open && sdWorld.hovered_entity ) || ( sdContextMenu.open && sdContextMenu.potential_option === null ) )
			{
				sdContextMenu.Open();
				
				if ( sdContextMenu.open )
				return true;
			}
		}
		else
		{
			if ( sdContextMenu.potential_option === null )
			{
				sdContextMenu.open = false;
				sdRenderer.UpdateCursor();
				return true;
			}
			else
			{
				sdContextMenu.potential_option.action();
				sdContextMenu.open = false;
				sdRenderer.UpdateCursor();
				return true;
			}
		}
		
		return false;
	}
	static Draw( ctx )
	{
		ctx.save();
		{
			ctx.translate( sdContextMenu.x, sdContextMenu.y );

			let width = 180;

			ctx.fillStyle = 'rgba(0,0,0,0.7)';
			ctx.fillRect( 0, 0, width, ( sdContextMenu.options.length + 1 ) * ( 30 ) );

			sdContextMenu.potential_option = null;
			
			for ( var i = -1; i < sdContextMenu.options.length; i++ )
			{
				var t = '';
				if ( i === -1 )
				{
					t = sdContextMenu.current_target.title || sdContextMenu.current_target.GetClass().slice( 2 );
				}
				else
				{
					t = sdContextMenu.options[ i ].title;
				}
				
				if ( i >= 0 )
				if ( sdWorld.mouse_screen_x >= sdContextMenu.x )
				if ( sdWorld.mouse_screen_x < sdContextMenu.x + width )
				if ( sdWorld.mouse_screen_y >= sdContextMenu.y + ( i + 1 ) * 30 )
				if ( sdWorld.mouse_screen_y < sdContextMenu.y + ( i + 1 + 1 ) * 30 )
				{
					if ( sdContextMenu.potential_option === null )
					{
						sdContextMenu.potential_option = sdContextMenu.options[ i ];
						
						ctx.fillStyle = 'rgba(255,255,0,0.3)';
						ctx.fillRect( 1, ( i + 1 ) * 30 + 1, width-2, 28 );
					}
				}
				
				if ( i === -1 )
				ctx.fillStyle = '#66aaff';
				else
				ctx.fillStyle = '#ffffff';
				
				ctx.font = "12px Verdana";
				ctx.textAlign = 'left';
				
				ctx.fillText( t, 10, 20 + ( i + 1 ) * 30, width - 20 );
			}
		}
		ctx.restore();
	}
}
export default sdContextMenu;