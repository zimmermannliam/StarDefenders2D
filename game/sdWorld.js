
import sdEntity from './entities/sdEntity.js';
import sdGun from './entities/sdGun.js';
import sdEffect from './entities/sdEffect.js';
import sdCom from './entities/sdCom.js';
import sdBullet from './entities/sdBullet.js';
import sdWeather from './entities/sdWeather.js';
import sdBlock from './entities/sdBlock.js';
import sdBG from './entities/sdBG.js';
import sdWater from './entities/sdWater.js';


import sdRenderer from './client/sdRenderer.js';
import sdSound from './sdSound.js';

class sdWorld
{
	static init_class()
	{
		console.warn('sdWorld class initiated');
		sdWorld.logic_rate = 16; // for server
		sdWorld.max_update_rate = 64;
		
		sdWorld.time = 0;
		sdWorld.frame = 0;
		
		sdWorld.gravity = 0.3;
		
		sdWorld.entity_classes = {}; // Will be filled up later
		
		sdWorld.is_server = ( typeof window === 'undefined' );
		sdWorld.mobile = false;
		
		sdWorld.sockets = null; // Becomes array
		
		sdWorld.camera = {
			x:0,
			y:0,
			scale:1
		};
		
		sdWorld.target_scale = 2;
		
		sdWorld.my_key_states = null; // Will be assigned to active entity to allow client-side movement
		
		sdWorld.my_entity = null;
		sdWorld.my_entity_net_id = undefined; // Temporary place
		sdWorld.my_entity_protected_vars = { look_x:1, look_y:1, x:1, y:1, sx:1, sy:1, act_x:1, act_y:1 }; // Client-side variables such as look_x will appear here
		sdWorld.my_score = 0;
		
		//sdWorld.world_bounds = { x1: 0, y1: -400, x2: 800, y2: 0 };
		sdWorld.world_bounds = { 
			x1: 0, 
			y1: 0, 
			x2: 0, 
			y2: 0
		};
		sdWorld.base_ground_level1 = [];
		sdWorld.base_ground_level2 = [];
		/*sdWorld.world_bounds = { 
			x1: 0, 
			y1: -2000, 
			x2: 800 * 10, 
			y2: 0
		};*/
		sdWorld.base_ground_level = 0;//-256;
		
		
		
		sdWorld.mouse_screen_x = 0;
		sdWorld.mouse_screen_y = 0;
		
		sdWorld.img_tile = sdWorld.CreateImageFromFile( 'bg' );
		sdWorld.img_sharp = sdWorld.CreateImageFromFile( 'sharp' );
		sdWorld.img_crosshair = sdWorld.CreateImageFromFile( 'crosshair' );
		sdWorld.img_crosshair_build = sdWorld.CreateImageFromFile( 'crosshair_build' );
		sdWorld.img_cursor = sdWorld.CreateImageFromFile( 'cursor' );
		
		
		//sdWorld.world_hash_positions = {};
		sdWorld.world_hash_positions = new Map();
		sdWorld.world_hash_positions_recheck_keys = []; // Array for keys to slowly check and delete if they are empty (can happen as a result of requiring cells by world logic)
		
		sdWorld.last_hit_entity = null;
		
		sdWorld.hovered_entity = null; // With cursor
		
		sdWorld.crystal_shard_value = 3;
		
		sdWorld.damage_to_matter = 0.025;
		//sdWorld.active_build_settings = { _class: 'sdBlock', width:16, height:16 }; // Changes every time some client tries to build something
		//sdWorld.active_build_settings = { _class: 'sdBlock', width:32, height:32 }; // Changes every time some client tries to build something
		
		sdWorld.leaders = [];

		function MobileCheck() 
		{
			if ( typeof navigator !== 'undefined' )
			{
				let check = false;
				(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
				return check;
			}
			return false;
		};
		
		if ( MobileCheck() )
		ForMobile();

		function ForMobile()
		{
			sdWorld.mobile = true;
			
			document.ontouchstart = start_handler;
			document.ontouchmove = move_handler;

			document.ontouchcancel = end_handler;
			document.ontouchend = end_handler;
			
			window.addEventListener('selectstart', function(e){ e.preventDefault(); });
			
			document.body.style.userSelect = 'none';

			var buttons = [];
			function RegisterButton( element_id, radius_mult, action_hold, action_release=null ) // action_hold( dx, dy, button_radius ) is called on tap and during move
			{
				if ( document.getElementById( element_id ) === null )
				alert('Button register error: ' + element_id );
				else
				buttons.push({ 
								element: document.getElementById( element_id ),
								radius_mult: radius_mult,
								action_hold: action_hold,
								action_release: action_release,
								touch_id: -1
							});
			}
			
			var move_x = 0;
			var move_y = 0;
			
			function HandleMoves()
			{
				if ( move_x > 0.5 )
				{
					window.onkeydown({ code:'KeyD' });
					window.onkeyup({ code:'KeyA' });
				}
				else
				if ( move_x < -0.5 )
				{
					window.onkeydown({ code:'KeyA' });
					window.onkeyup({ code:'KeyD' });
				}
				else
				{
					window.onkeyup({ code:'KeyA' });
					window.onkeyup({ code:'KeyD' });
				}
				
				
				if ( move_y > 0.5 )
				{
					window.onkeydown({ code:'KeyS' });
					window.onkeyup({ code:'KeyW' });
				}
				else
				if ( move_y < -0.5 )
				{
					window.onkeydown({ code:'KeyW' });
					window.onkeyup({ code:'KeyS' });
				}
				else
				{
					window.onkeyup({ code:'KeyW' });
					window.onkeyup({ code:'KeyS' });
				}
			}
			//setInterval( HandleMoves, 16 );
			
			function Tap( key )
			{
				window.onkeydown({ code:key });
				window.onkeyup({ code:key });
				/*setTimeout(()=> Should no longer be needed
				{
					window.onkeyup({ code:key });
				},100 );*/
			}
			
			setTimeout( function()
			{
				document.getElementById('mobile_ui').style.display = 'block';
				
				let min_aim_radius = 32;
				
				sdWorld.mouse_screen_x = sdRenderer.screen_width / 2 + min_aim_radius;
				sdWorld.mouse_screen_y = sdRenderer.screen_height / 2;
			
				RegisterButton( 'mobile_move_button', 1.2, function( dx, dy, button_radius ){
					move_x = dx / button_radius * 1.5;
					move_y = dy / button_radius * 1.5;
					HandleMoves();
				}, function() {
					move_x = 0;
					move_y = 0;
					HandleMoves();
				});

				RegisterButton( 'mobile_shoot_button', 1.2, function( dx, dy, button_radius ){ 
					
					dx *= 2;
					dy *= 2;
					let di = sdWorld.Dist2D_Vector( dx,dy );
					if ( di < min_aim_radius )
					{
						dx = dx / di * min_aim_radius;
						dy = dy / di * min_aim_radius;
					}
					sdWorld.mouse_screen_x = sdRenderer.screen_width / 2 + dx;
					sdWorld.mouse_screen_y = sdRenderer.screen_height / 2 + dy;
					
					window.onkeydown({ code:'Mouse1' }); 
					
				}, function() { 
					
					window.onkeyup({ code:'Mouse1' }); 
				});

				//RegisterButton( 'mobile_jump_button', 1, function(){ sdWorld.hold_space = 1; }, function() { sdWorld.hold_space = 0; });
				//RegisterButton( 'mobile_zoom_button', 1, function(){ sdWorld.zoom_intensity_target = 0.5; }, function() { sdWorld.zoom_intensity_target = 1; });
				//RegisterButton( 'mobile_crouch_button', 1, function(){ sdWorld.hold_ctrl = 1; }, function() { sdWorld.hold_ctrl = 0; });
				RegisterButton( 'mobile_reload_button', 1, function(){ Tap('KeyR'); });
				RegisterButton( 'mobile_1_button', 1, function(){ Tap('Digit1'); });
				RegisterButton( 'mobile_2_button', 1, function(){ Tap('Digit2'); });
				RegisterButton( 'mobile_3_button', 1, function(){ Tap('Digit3'); });
				RegisterButton( 'mobile_4_button', 1, function(){ Tap('Digit4'); });
				RegisterButton( 'mobile_5_button', 1, function(){ Tap('Digit5'); });
				RegisterButton( 'mobile_x_button', 1, function(){ Tap('Digit9'); });
				RegisterButton( 'mobile_s_button', 1, function(){ Tap('Digit0'); });
				
			}, 100 );
			
			function start_handler( e )
			{
				if ( document.getElementById( 'mobile_ui' ).style.display === 'none' )
				return;
			
				sdWorld.GoFullscreen();
				
				screen.orientation.lock('landscape');
			
				for ( var i = 0; i < buttons.length; i++ )
				{
					var button_rect = buttons[ i ].element.getBoundingClientRect();
					var button_x = ( button_rect.right + button_rect.left ) / 2;
					var button_y = ( button_rect.top + button_rect.bottom ) / 2;
					var button_radius = ( button_rect.right - button_rect.left ) / 2;
					
					if ( sdWorld.Dist2D( e.changedTouches[ 0 ].pageX, e.changedTouches[ 0 ].pageY, button_x, button_y ) <= button_radius * buttons[ i ].radius_mult )
					{
						buttons[ i ].touch_id = e.changedTouches[ 0 ].identifier;
						buttons[ i ].action_hold( e.changedTouches[ 0 ].pageX - button_x, e.changedTouches[ 0 ].pageY - button_y, button_radius );
						
						buttons[ i ].element.style.backgroundColor = '#000000';
						
						e.preventDefault();
						break;
					}
				}
				
			}

			function end_handler( e )
			{
				for ( var i = 0; i < buttons.length; i++ )
				{
					if ( e.changedTouches[ 0 ].identifier === buttons[ i ].touch_id )
					{
						buttons[ i ].touch_id = -1;
						if ( buttons[ i ].action_release !== null )
						buttons[ i ].action_release();
					
						buttons[ i ].element.style.backgroundColor = '#ffffff0d';
						
						e.preventDefault();
						break;
					}
				}
			}

			function move_handler( e )
			{
				if ( document.getElementById( 'mobile_ui' ).style.display === 'none' )
				return;
			
				for ( var i = 0; i < buttons.length; i++ )
				{
					if ( buttons[ i ].touch_id === e.changedTouches[ 0 ].identifier )
					{
						var button_rect = buttons[ i ].element.getBoundingClientRect();
						var button_x = ( button_rect.right + button_rect.left ) / 2;
						var button_y = ( button_rect.top + button_rect.bottom ) / 2;
						var button_radius = ( button_rect.right - button_rect.left ) / 2;

						buttons[ i ].action_hold( e.changedTouches[ 0 ].pageX - button_x, e.changedTouches[ 0 ].pageY - button_y, button_radius );
						
						
						e.preventDefault();
						break;
					}
				}
			}
		};
	}
	static GoFullscreen()
	{
		if (!document.fullscreenElement && 
			!document.mozFullScreenElement && !document.webkitFullscreenElement) {
			if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
		}

		if ( document.pointerLockElement !== sdRenderer.canvas )
		sdRenderer.canvas.requestPointerLock();
	
		window.onresize();
	}
	static ChangeWorldBounds( x1, y1, x2, y2 )
	{
		var ent;
		
		function GetGroundElevation( xx )
		{
			return sdWorld.base_ground_level - Math.round( ( Math.sin( sdWorld.base_ground_level1[ xx ] ) * 64 + Math.sin( sdWorld.base_ground_level2[ xx ] ) * 64 ) / 16 ) * 16;
		}
		
		function FillGroundQuad( x, y, from_y )
		{
			let f = 'hue-rotate('+( ~~sdWorld.mod( x / 16, 360 ) )+'deg)';
			
			let hp_mult = 1;
			
			if ( y > sdWorld.base_ground_level + 256 )
			{
				hp_mult = 1 + ( y - sdWorld.base_ground_level - 256 ) / 200;
				f += 'brightness(' + ( 1 / hp_mult ) + ') saturate(' + ( 1 / hp_mult ) + ')';
			}
			
			if ( y >= from_y )
			{
				let enemy_rand_num = Math.random();
				let random_enemy;
				
				if ( Math.pow( enemy_rand_num, 4 ) > 1 / hp_mult )
				random_enemy = 'sdOctopus';
				else
				if ( Math.pow( enemy_rand_num, 2 ) > 0.8 / hp_mult )
				random_enemy = 'sdQuickie';
				else
				random_enemy = 'sdVirus';
				
				
				
				ent = new sdBlock({ 
					x:x, 
					y:y, 
					width:16, 
					height:16,
					material: sdBlock.MATERIAL_GROUND,
					contains_class: ( Math.random() > 0.75 / hp_mult ) ? ( Math.random() < 0.3 ? random_enemy : 'sdCrystal' ) : null,
					filter: f,
					natural: true
					//filter: 'hue-rotate('+(~~(Math.sin( ( Math.min( from_y, sdWorld.world_bounds.y2 - 256 ) - y ) * 0.005 )*360))+'deg)' 
				});
				
				if ( hp_mult > 0 )
				{
					ent._hea *= hp_mult;
					ent._hmax *= hp_mult;
				}
			}
			else
			{
				ent = new sdBG({ x:x, y:y, width:16, height:16, material:sdBG.MATERIAL_GROUND, filter:'brightness(0.5) ' + f });
				
				let ent2 = new sdWater({ x:x, y:y, volume:(y===sdWorld.base_ground_level)?0.5:1 });
				sdEntity.entities.push( ent2 );
			}

			sdEntity.entities.push( ent );
		}

		// Extension down, using same base ground levels
		for ( var x = sdWorld.world_bounds.x1; x < sdWorld.world_bounds.x2; x += 16 )
		{
			var xx = Math.floor( x / 16 );
			var from_y = GetGroundElevation( xx );
			
			//for ( var y = Math.max( from_y, sdWorld.world_bounds.y2 ); y < y2; y += 16 ) // Only append
			for ( var y = Math.max( Math.min( from_y, sdWorld.base_ground_level ), Math.min( y1, sdWorld.world_bounds.y1 ) ); y < y2; y += 16 ) // Only append
			if ( y < sdWorld.world_bounds.y1 || y >= sdWorld.world_bounds.y2 )
			{
				FillGroundQuad( x, y, from_y );
			}
		}
		
		// Extension to right
		for ( var x = sdWorld.world_bounds.x2; x < x2; x += 16 )
		{
			var xx = Math.floor( x / 16 );
			sdWorld.base_ground_level1[ xx ] = sdWorld.base_ground_level1[ xx - 1 ] || 0;
			sdWorld.base_ground_level2[ xx ] = sdWorld.base_ground_level2[ xx - 1 ] || 0;
			
			sdWorld.base_ground_level1[ xx ] += ( Math.random() - 0.5 ) * 0.2;
			sdWorld.base_ground_level2[ xx ] += ( Math.random() - 0.25 ) * 0.1;

			var from_y = GetGroundElevation( xx );
			
			for ( var y = Math.max( Math.min( from_y, sdWorld.base_ground_level ), y1 ); y < y2; y += 16 ) // Whole relevant height
			{
				FillGroundQuad( x, y, from_y );
			}
		}
		
		// Extension to left
		for ( var x = sdWorld.world_bounds.x1 - 16; x >= x1; x -= 16 )
		{
			var xx = Math.floor( x / 16 );
			sdWorld.base_ground_level1[ xx ] = sdWorld.base_ground_level1[ xx + 1 ] || 0;
			sdWorld.base_ground_level2[ xx ] = sdWorld.base_ground_level2[ xx + 1 ] || 0;
			
			sdWorld.base_ground_level1[ xx ] -= ( Math.random() - 0.5 ) * 0.2;
			sdWorld.base_ground_level2[ xx ] -= ( Math.random() - 0.25 ) * 0.1;

			var from_y = GetGroundElevation( xx );
			
			for ( var y = Math.max( Math.min( from_y, sdWorld.base_ground_level ), y1 ); y < y2; y += 16 ) // Whole relevant height
			{
				FillGroundQuad( x, y, from_y );
			}
		}
		
		// Delete outbound items
		if ( sdWeather.only_instance )
		{
			sdWeather.only_instance.x = x1;
			sdWeather.only_instance.y = y1;
		}
		
		sdSound.server_mute = true;
		for ( let i = 0; i < sdEntity.entities.length; i++ )
		{
			var e = sdEntity.entities[ i ];
			if ( e.x + e.hitbox_x2 < x1 || e.x + e.hitbox_x1 > x2 || e.y + e.hitbox_y2 < y1 || e.y + e.hitbox_y1 > y2 )
			{
				e.remove();
				e._remove();
				sdEntity.entities.splice( i, 1 );
				i--;
				continue;
			}
		}
		sdSound.server_mute = false;
		
		sdWorld.world_bounds.x1 = x1;
		sdWorld.world_bounds.y1 = y1;
		sdWorld.world_bounds.x2 = x2;
		sdWorld.world_bounds.y2 = y2;
	}
	static CanSocketSee( socket, x, y )
	{
		if ( socket.character && socket.post_death_spectate_ttl > 0 )
		if ( x > socket.character.x - 800 )
		if ( x < socket.character.x + 800 )
		if ( y > socket.character.y - 400 )
		if ( y < socket.character.y + 400 )
		{
			return true;
		}
		return false;
	}
	static DropShards( x,y,sx,sy, tot, value_mult )
	{
		if ( sdWorld.is_server )
		{
			for ( var i = 0; i < tot; i++ )
			{
				let ent = new sdGun({ class:sdGun.CLASS_CRYSTAL_SHARD, x: x, y:y });
				ent.sx = sx + Math.random() * 8 - 4;
				ent.sy = sy + Math.random() * 8 - 4;
				ent.ttl = 30 * 7 * ( 0.7 + Math.random() * 0.3 );
				ent.extra = value_mult * sdWorld.crystal_shard_value;
				sdEntity.entities.push( ent );
			}
		}
	}
	static SendEffect( params, command='EFF' ) // 'S' for sound
	{
		if ( !sdWorld.is_server )
		return;
				
		let extra_affected_chars = [];
		
		//console.log('send effect');
	
		if ( params.attachment )
		{
			//console.log('.attachment found');
			
			if ( params.type === sdEffect.TYPE_CHAT )
			if ( params.attachment._coms_allowed )
			{
				let coms_near = [];
				
				sdWorld.GetComsNear( params.x, params.y, coms_near, params.attachment._net_id );
				//console.log('[zero hop]coms_near = ', coms_near.length);
				
				let tot_before = 0;
				let tot_after;
				let i = 0;
				do
				{
					tot_before = coms_near.length;
					
					while ( i < tot_before )
					{
						sdWorld.GetComsNear( coms_near[ i ].x, coms_near[ i ].y, coms_near, params.attachment._net_id );
						//console.log('[hop]coms_near = ', coms_near.length);
						
						i++;
					}
					
					tot_after = coms_near.length;
					
				} while( tot_after !== tot_before );
				
				for ( i = 0; i < coms_near.length; i++ )
				{
					sdWorld.GetCharactersNear( coms_near[ i ].x, coms_near[ i ].y, extra_affected_chars, coms_near[ i ].subscribers );
					//console.log('[hop]extra_affected_chars = ', extra_affected_chars.length);
				}
			}
			
			params.attachment = [ params.attachment.GetClass(), params.attachment._net_id ];
		}
		
		if ( params.type === sdEffect.TYPE_EXPLOSION )
		{
			/*let targets = sdWorld.GetAnythingNear( params.x, params.y, params.radius );
			
			for ( var i = 0; i < targets.length; i++ )
			targets[ i ].Damage( params.radius * 2 );*/
			
			if ( params.color === undefined )
			throw new Error('Should not happen');
			
			let initial_rand = Math.random() * Math.PI * 2;
			for ( let an = 0; an < 16; an++ )
			{
				
				let bullet_obj = new sdBullet({ 
					x: params.x + Math.sin( an + initial_rand ) * 1, 
					y: params.y + Math.cos( an + initial_rand ) * 1 
				});
				bullet_obj.sx = Math.sin( an + initial_rand ) * params.radius;
				bullet_obj.sy = Math.cos( an + initial_rand ) * params.radius;
				bullet_obj._wave = true;
				bullet_obj.time_left = 2;
				bullet_obj._damage = 10 * ( params.damage_scale || 1 ) * ( params.radius / 19 );
				bullet_obj._owner = params.owner || null;
				sdEntity.entities.push( bullet_obj );
			}
			delete params.damage_scale;
			
			if ( params.owner ) // Will point to real object
			delete params.owner;
		}
		
		for ( var i = 0; i < sdWorld.sockets.length; i++ )
		{
			var socket = sdWorld.sockets[ i ];
			
			if ( 
				 ( socket.character && socket.character.hea > 0 && 
				   extra_affected_chars.indexOf( socket.character ) !== -1 ) ||
				   
				 sdWorld.CanSocketSee( socket, params.x, params.y ) || 
				 
				 ( typeof params.x2 !== 'undefined' && 
				   typeof params.y2 !== 'undefined' && 
				   sdWorld.CanSocketSee( socket, params.x2, params.y2 ) ) ) // rails
			{
				socket.emit( command, params );
			}
		}
	}
	static SendSound( params )
	{
		sdWorld.SendEffect( params, 'S' );
	}
	static GetComsNear( _x, _y, append_to=null, require_auth_for_net_id=null )
	{
		let ret = append_to || [];
		
		let min_x = _x - sdCom.retransmit_range - 32;
		let max_x = _x + sdCom.retransmit_range + 32;
		let min_y = _y - sdCom.retransmit_range - 32;
		let max_y = _y + sdCom.retransmit_range + 32;
		let x, y, arr, i;
		for ( x = min_x; x <= max_x; x += 32 )
		for ( y = min_y; y <= max_y; y += 32 )
		{
			arr = sdWorld.RequireHashPosition( x, y );
			for ( i = 0; i < arr.length; i++ )
			if ( arr[ i ].GetClass() === 'sdCom' )
			if ( require_auth_for_net_id === null || arr[ i ].subscribers.indexOf( require_auth_for_net_id ) !== -1 )
			if ( ret.indexOf( arr[ i ] ) === -1 )
			ret.push( arr[ i ] );
		}
		return ret;
	}
	static GetCharactersNear( _x, _y, append_to=null, require_auth_for_net_id_by_list=null )
	{
		let ret = append_to || [];
		
		let min_x = _x - sdCom.retransmit_range - 32;
		let max_x = _x + sdCom.retransmit_range + 32;
		let min_y = _y - sdCom.retransmit_range - 32;
		let max_y = _y + sdCom.retransmit_range + 32;
		let x, y, arr, i;
		for ( x = min_x; x <= max_x; x += 32 )
		for ( y = min_y; y <= max_y; y += 32 )
		{
			arr = sdWorld.RequireHashPosition( x, y );
			for ( i = 0; i < arr.length; i++ )
			if ( arr[ i ].GetClass() === 'sdCharacter' )
			if ( require_auth_for_net_id_by_list === null || ( arr[ i ]._coms_allowed && require_auth_for_net_id_by_list.indexOf( arr[ i ]._net_id ) !== -1 ) )
			if ( ret.indexOf( arr[ i ] ) === -1 )
			ret.push( arr[ i ] );
		}
		return ret;
	}
	static GetAnythingNear( _x, _y, range, append_to=null )
	{
		let ret = append_to || [];
		
		let min_x = _x - range - 32;
		let max_x = _x + range + 32;
		let min_y = _y - range - 32;
		let max_y = _y + range + 32;
		let x, y, arr, i;
		let cx,cy;
		for ( x = min_x; x <= max_x; x += 32 )
		for ( y = min_y; y <= max_y; y += 32 )
		{
			arr = sdWorld.RequireHashPosition( x, y );
			for ( i = 0; i < arr.length; i++ )
			if ( ret.indexOf( arr[ i ] ) === -1 )
			{
				cx = Math.max( arr[ i ].x + arr[ i ].hitbox_x1, Math.min( _x, arr[ i ].x + arr[ i ].hitbox_x2 ) );
				cy = Math.max( arr[ i ].y + arr[ i ].hitbox_y1, Math.min( _y, arr[ i ].y + arr[ i ].hitbox_y2 ) );
				if ( sdWorld.inDist2D( _x, _y, cx, cy, range ) >= 0 )
				ret.push( arr[ i ] );
			}
		}
		return ret;
	}
	static ResolveMyEntityByNetId()
	{
		//console.warn('ResolveMyEntityByNetId()');
		if ( sdWorld.my_entity === null || sdWorld.my_entity_net_id !== sdWorld.my_entity._net_id )
		{
			sdWorld.my_entity = null;
			for ( var i = 0; i < sdEntity.entities.length; i++ )
			if ( !sdEntity.entities[ i ]._is_being_removed )
			{
				if ( sdEntity.entities[ i ]._net_id === sdWorld.my_entity_net_id )
				{
					//console.warn('resolved!');
					sdWorld.my_entity = sdEntity.entities[ i ];
					sdWorld.my_entity._key_states = sdWorld.my_key_states;
					
					
					sdWorld.camera.x = sdWorld.my_entity.x;
					sdWorld.camera.y = sdWorld.my_entity.y;

					
					return;
				}
			}
		}
	}
	

	static shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		}
	}
	static Dist2D_Vector_pow2( tox, toy )
	{
		return ( tox*tox + toy*toy );
	}
	static Dist2D_Vector( tox, toy )
	{
		return Math.sqrt( sdWorld.Dist2D_Vector_pow2( tox, toy ) );
	}
	static Dist2D( x1, y1, x2, y2 )
	{
		return sdWorld.Dist2D_Vector( x1-x2, y1-y2 );
	}
	static inDist2D( x1, y1, x2, y2, rad )
	{
		if ( x1 <= x2 - rad )
		return -1;

		if ( x1 >= x2 + rad )
		return -1;

		if ( y1 <= y2 - rad )
		return -1;

		if ( y1 >= y2 + rad )
		return -1;

		var di = sdWorld.Dist2D_Vector_pow2( x1-x2, y1-y2 );

		if ( di > rad * rad )
		return -1;

		return Math.sqrt( di );
	}
	static MorphWithTimeScale( current, to, remain, _GSPEED, snap_range=0 )
	{
		remain = Math.pow( remain, _GSPEED );
		current = to * ( 1 - remain ) + current * remain;
		
		if ( snap_range !== 0 )
		if ( Math.abs( current - to ) <= snap_range )
		return to;

		return current;
	}
	static RequireHashPosition( x, y )
	{
		/*
		x = ~~( x / 32 );
		y = ~~( y / 32 );
		
		//x = Math.floor( x / 32 );
		//y = Math.floor( y / 32 );
		
		var a;
		
		if ( typeof sdWorld.world_hash_positions[ x ] === 'undefined' )
		a = sdWorld.world_hash_positions[ x ] = {};
		else
		a = sdWorld.world_hash_positions[ x ];
	
		var b;
	
		if ( typeof a[ y ] === 'undefined' )
		b = a[ y ] = [];
		else
		b = a[ y ];
	
		return b;*/
		
		//x = ~~( x / 32 );
		//y = ;
		
		//x = ( ~~( y / 32 ) ) * 4098 + ~~( x / 32 ); // Too many left-over empty arrays when bounds move?
		
		x = ( ~~( y / 32 ) ) * 4098 + ~~( x / 32 );
		
		if ( !sdWorld.world_hash_positions.has( x ) )
		{
			let arr = [];
			arr.hash = x;
			sdWorld.world_hash_positions.set( x, arr );
			
			if ( sdWorld.world_hash_positions_recheck_keys.indexOf( x ) === -1 )
			sdWorld.world_hash_positions_recheck_keys.push( x );
		}
		
		return sdWorld.world_hash_positions.get( x );
		
	}
	static UpdateHashPosition( entity, delay_callback_calls )
	{
		let new_hash_position = entity._is_being_removed ? null : sdWorld.RequireHashPosition( entity.x, entity.y );
		
		if ( entity._hash_position !== new_hash_position )
		{
			if ( entity._hash_position !== null )
			{
				let ind = entity._hash_position.indexOf( entity );
				if ( ind === -1 )
				throw new Error('Bad hash object');
				entity._hash_position.splice( ind, 1 );
				
				if ( entity._hash_position.length === 0 )
				{
					sdWorld.world_hash_positions.delete( entity._hash_position.hash );
				}
			}

			entity._hash_position = new_hash_position;
			if ( new_hash_position !== null )
			entity._hash_position.push( entity );
		}
		
		if ( entity._is_being_removed )
		return;
		
		if ( delay_callback_calls )
		{
			// Trigger instant collision check
			entity._last_x = undefined;
			entity._last_y = undefined;
		}
		else
		{
			var map = new Map();
			for ( var x = -1; x <= 1; x++ )
			for ( var y = -1; y <= 1; y++ )
			{
				var local_hash_array = sdWorld.RequireHashPosition( entity.x + x * 32, entity.y + y * 32 );
				for ( var i = 0; i < local_hash_array.length; i++ )
				{
					map.set( local_hash_array[ i ], local_hash_array[ i ] );
				}
			}
			// Make entities reach to each other in both directions
			map.forEach( ( another_entity )=>
			{
				if ( another_entity !== entity )
				if ( !another_entity._is_being_removed )
				if ( !entity._is_being_removed ) // Just so bullets won't hit multiple targets
				{
					if ( entity.x + entity.hitbox_x2 > another_entity.x + another_entity.hitbox_x1 &&
						 entity.x + entity.hitbox_x1 < another_entity.x + another_entity.hitbox_x2 &&
						 entity.y + entity.hitbox_y2 > another_entity.y + another_entity.hitbox_y1 &&
						 entity.y + entity.hitbox_y1 < another_entity.y + another_entity.hitbox_y2 )
					{
						entity.onMovementInRange( another_entity );
						another_entity.onMovementInRange( entity );
					}
				}
			});
		}
	}
	static HandleWorldLogicNoPlayers()
	{
		sdWorld.time = Date.now();
		//sdWorld.frame++; Not needed if nothing happens
	}
	static HandleWorldLogic()
	{
		let old_time = sdWorld.time;
		
		sdWorld.time = Date.now();
		
		//let substeps = sdWorld.is_server ? 2 : 2;
		//let substeps = 2;
		
		//for ( var step = 0; step < substeps; step++ )
		//{
			let GSPEED = Math.min( 1, Math.max( 0, ( sdWorld.time - old_time ) / 1000 * 30 ) );// / substeps;

			//console.log( GSPEED );

			for ( var arr_i = 0; arr_i < 2; arr_i++ )
			{
				//var arr = ( arr_i === 0 ) ? sdEntity.entities : sdEntity.global_entities;
				var arr = ( arr_i === 0 ) ? sdEntity.active_entities : sdEntity.global_entities;
				
				loop1: for ( var i = 0; i < arr.length; i++ )
				{
					var e = arr[ i ];

					for ( var step = 0; step < e.substeps || e.progress_until_removed; step++ )
					{
						let time_from = Date.now();
						
						if ( e._is_being_removed || 
							 e.Think( GSPEED / e.substeps ) )
						{
							let hiber_state = e._hiberstate;
							
							e._remove();
							let time_to = Date.now();
							if ( time_to - time_from > 5 )
							sdWorld.SendEffect({ x:e.x, y:e.y, type:sdEffect.TYPE_LAG, text:e.GetClass()+': '+(time_to - time_from)+'ms' });
							
							if ( arr_i === 0 )
							{
								let id = sdEntity.entities.indexOf( e );
								if ( id === -1 )
								{
									console.log('Removing unlisted entity, hiberstate was '+hiber_state );
									debugger;
								}
								else
								sdEntity.entities.splice( id, 1 );
							}
							
							if ( arr[ i ] === e ) // Removal did not happen?
							{
								arr.splice( i, 1 );
								i--;
							}
							continue loop1; // Or else it will try to get removed in each substep of a bullet
						}
						let time_to = Date.now();
						if ( time_to - time_from > 5 )
						sdWorld.SendEffect({ x:e.x, y:e.y, type:sdEffect.TYPE_LAG, text:e.GetClass()+': '+(time_to - time_from)+'ms' });

						if ( e._last_x !== e.x ||
							 e._last_y !== e.y )
						{
							e._last_x = e.x;
							e._last_y = e.y;

							if ( !e._is_being_removed )
							sdWorld.UpdateHashPosition( e, false );
						}
					}
				}
			}

			if ( !sdWorld.is_server )
			{
				if ( sdWorld.my_entity )
				{
					if ( sdWorld.mobile )
					{
						sdWorld.camera.x = sdWorld.my_entity.x;
						sdWorld.camera.y = sdWorld.my_entity.y;
					}
					else
					{
						sdWorld.camera.x = sdWorld.MorphWithTimeScale( sdWorld.camera.x, ( sdWorld.my_entity.x + sdWorld.my_entity.look_x ) / 2, 1 - 10/11, GSPEED/30 );
						sdWorld.camera.y = sdWorld.MorphWithTimeScale( sdWorld.camera.y, ( sdWorld.my_entity.y + sdWorld.my_entity.look_y ) / 2, 1 - 10/11, GSPEED/30 );
					}

					sdWorld.camera.x = Math.round( sdWorld.camera.x * sdWorld.camera.scale ) / sdWorld.camera.scale;
					sdWorld.camera.y = Math.round( sdWorld.camera.y * sdWorld.camera.scale ) / sdWorld.camera.scale;

					sdWorld.camera.scale = sdWorld.MorphWithTimeScale( sdWorld.camera.scale, sdWorld.target_scale, 1 - 10/11, GSPEED/30, 0.01 );

					//sdWorld.camera.x = sdWorld.my_entity.x;
					//sdWorld.camera.y = sdWorld.my_entity.y;
					//sdWorld.camera.scale = 2;


					sdWorld.my_entity.look_x = sdWorld.mouse_screen_x / sdWorld.camera.scale + sdWorld.camera.x - sdRenderer.screen_width / 2 / sdWorld.camera.scale;
					sdWorld.my_entity.look_y = sdWorld.mouse_screen_y / sdWorld.camera.scale + sdWorld.camera.y - sdRenderer.screen_height / 2 / sdWorld.camera.scale;
				}
				
				sdSound.HandleMatterChargeLoop( GSPEED );
			}
		//}
		
		if ( sdWorld.is_server )
		{
			let sockets = sdWorld.sockets;
			sdWorld.leaders.length = 0;
			for ( let i2 = 0; i2 < sockets.length; i2++ )
			if ( sockets[ i2 ].character && !sockets[ i2 ].character._is_being_removed )
			sdWorld.leaders.push({ name:sockets[ i2 ].character.title, score:sockets[ i2 ].score });

			sdWorld.leaders.sort((a,b)=>{return b.score - a.score;});
			
			if ( sdWorld.leaders.length > 15 )
			sdWorld.leaders = sdWorld.leaders.slice( 0, 15 );
		}
		
		if ( sdWorld.world_hash_positions_recheck_keys.length > 0 )
		for ( var s = Math.max( 32, sdWorld.world_hash_positions_recheck_keys.length * 0.1 ); s >= 0; s-- )
		{
			let x = sdWorld.world_hash_positions_recheck_keys[ 0 ];
			
			if ( sdWorld.world_hash_positions.has( x ) )
			if ( sdWorld.world_hash_positions.get( x ).length === 0 )
			sdWorld.world_hash_positions.delete( x );
	
			sdWorld.world_hash_positions_recheck_keys.shift();
		}
		
		// Keep it last:
		sdWorld.frame++;
	}
	
		
	static mod( a, n )
	{
		return ((a%n)+n)%n;
	}
	
	static CheckWallExistsBox( x1, y1, x2, y2, ignore_entity=null, ignore_entity_classes=null, include_only_specific_classes=null ) // under 32x32 boxes unless line with arr = sdWorld.RequireHashPosition( x1 + xx * 32, y1 + yy * 32 ); changed
	{
		if ( y1 < sdWorld.world_bounds.y1 || 
			 y2 > sdWorld.world_bounds.y2 || 
			 x1 < sdWorld.world_bounds.x1 ||
			 x2 > sdWorld.world_bounds.x2 )
		{
			sdWorld.last_hit_entity = null;
			return true;
		}
	
		let arr;
		let i;
		
		var xx_from = x1 - 32;
		var yy_from = y1 - 32;
		var xx_to = x2 + 32;
		var yy_to = y2 + 32;
	
		//for ( var xx = -1; xx <= 2; xx++ )
		//for ( var yy = -1; yy <= 2; yy++ )
		//for ( var xx = -1; xx <= 0; xx++ ) Was not enough for doors, sometimes they would have left vertical part lacking collision with players
		//for ( var yy = -1; yy <= 0; yy++ )
		//for ( var xx = -1; xx <= 1; xx++ )
		//for ( var yy = -1; yy <= 1; yy++ )
		for ( var xx = xx_from; xx <= xx_to; xx += 32 )
		for ( var yy = yy_from; yy <= yy_to; yy += 32 )
		{
			//arr = sdWorld.RequireHashPosition( x1 + xx * 32, y1 + yy * 32 );
			//arr = sdWorld.RequireHashPosition( x2 + xx * 32, y2 + yy * 32 ); // Better player-matter container collisions. Worse for player-block cases
			arr = sdWorld.RequireHashPosition( xx, yy );
			
			for ( i = 0; i < arr.length; i++ )
			if ( arr[ i ].hard_collision || include_only_specific_classes )
			if ( arr[ i ] !== ignore_entity )
			if ( ignore_entity === null || arr[ i ].IsBGEntity() === ignore_entity.IsBGEntity() )
			{
				if ( x2 >= arr[ i ].x + arr[ i ].hitbox_x1 )
				if ( x1 <= arr[ i ].x + arr[ i ].hitbox_x2 )
				if ( y2 >= arr[ i ].y + arr[ i ].hitbox_y1 )
				if ( y1 <= arr[ i ].y + arr[ i ].hitbox_y2 )
				{
					if ( include_only_specific_classes )
					if ( include_only_specific_classes.indexOf( arr[ i ].GetClass() ) === -1 )
					continue;
					
					if ( ignore_entity_classes !== null )
					if ( ignore_entity_classes.indexOf( arr[ i ].GetClass() ) !== -1 )
					continue;
					
					sdWorld.last_hit_entity = arr[ i ];
					return true;
				}
			}
		}
	
		return false;
	}
	static CheckLineOfSight( x1, y1, x2, y2, ignore_entity=null, ignore_entity_classes=null, include_only_specific_classes=null )
	{
		var di = sdWorld.Dist2D( x1,y1,x2,y2 );
		var step = 16;
		
		for ( var s = step / 2; s < di - step / 2; s += step )
		{
			var x = x1 + ( x2 - x1 ) / di * s;
			var y = y1 + ( y2 - y1 ) / di * s;
			if ( sdWorld.CheckWallExists( x, y, ignore_entity, ignore_entity_classes, include_only_specific_classes ) )
			return false;
		}
		return true;
	}
	static CheckWallExists( x, y, ignore_entity=null, ignore_entity_classes=null, include_only_specific_classes=null )
	{
		if ( y < sdWorld.world_bounds.y1 || 
			 y > sdWorld.world_bounds.y2 || 
			 x < sdWorld.world_bounds.x1 ||
			 x > sdWorld.world_bounds.x2 )
		{
			sdWorld.last_hit_entity = null;
			return true;
		}
	
		let arr;
		let i;
	
		//for ( var xx = -1; xx <= 2; xx++ )
		//for ( var yy = -1; yy <= 2; yy++ )
		//for ( var xx = -1; xx <= 0; xx++ ) Was not enough for doors, sometimes they would have left vertical part lacking collision with players
		//for ( var yy = -1; yy <= 0; yy++ )
		for ( var xx = -1; xx <= 1; xx++ )
		for ( var yy = -1; yy <= 1; yy++ )
		{
			arr = sdWorld.RequireHashPosition( x + xx * 32, y + yy * 32 );
			for ( i = 0; i < arr.length; i++ )
			if ( arr[ i ].hard_collision || include_only_specific_classes )
			if ( arr[ i ] !== ignore_entity )
			if ( ignore_entity === null || arr[ i ].IsBGEntity() === ignore_entity.IsBGEntity() )
			{
				if ( x >= arr[ i ].x + arr[ i ].hitbox_x1 )
				if ( x <= arr[ i ].x + arr[ i ].hitbox_x2 )
				if ( y >= arr[ i ].y + arr[ i ].hitbox_y1 )
				if ( y <= arr[ i ].y + arr[ i ].hitbox_y2 )
				{
					if ( include_only_specific_classes )
					if ( include_only_specific_classes.indexOf( arr[ i ].GetClass() ) === -1 )
					continue;
					
					if ( ignore_entity_classes !== null )
					if ( ignore_entity_classes.indexOf( arr[ i ].GetClass() ) !== -1 )
					continue;
					
					sdWorld.last_hit_entity = arr[ i ];
					return true;
				}
			}
		}
	
		return false;
	}
	static hexToRgb(hex) 
	{
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result ? [
		  parseInt(result[1], 16),
		  parseInt(result[2], 16),
		  parseInt(result[3], 16)
		] : null;
	}
	static ReplaceColorInSDFilter( sd_filter, from, to )
	{
		if ( typeof from === 'string' )
		{
			from = sdWorld.hexToRgb( from );
			if ( from === null )
			return;
		}
		else
		if ( typeof from !== 'array' )
		return;

		if ( typeof to === 'string' )
		{
			to = sdWorld.hexToRgb( to );
			if ( to === null )
			return;
		}
		else
		if ( typeof to !== 'array' )
		return;
		
		if ( typeof sd_filter[ from[ 0 ] ] === 'undefined' )
		sd_filter[ from[ 0 ] ] = {};
	
		if ( typeof sd_filter[ from[ 0 ] ][ from[ 1 ] ] === 'undefined' )
		sd_filter[ from[ 0 ] ][ from[ 1 ] ] = {};
	
		//if ( typeof sd_filter[ from[ 0 ] ][ from[ 1 ] ][ from[ 2 ] ] === 'undefined' )
		sd_filter[ from[ 0 ] ][ from[ 1 ] ][ from[ 2 ] ] = to;
	}
	static ConvertPlayerDescriptionToSDFilter( player_description )
	{
		let ret = {};
		
		sdWorld.ReplaceColorInSDFilter( ret, '#c0c0c0', player_description['color_bright'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#808080', player_description['color_dark'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#ff0000', player_description['color_visor'] );
		//sdWorld.ReplaceColorInSDFilter( ret, '#800000', player_description['color_splashy'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#000080', player_description['color_suit'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#800080', player_description['color_suit2'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#ff00ff', player_description['color_dark2'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#000000', player_description['color_shoes'] );
		sdWorld.ReplaceColorInSDFilter( ret, '#808000', player_description['color_skin'] );
		
		return ret;
	}
	static ConvertPlayerDescriptionToVoice( player_description )
	{
		let _voice = {
			wordgap: 0,
			pitch: 50,
			speed: 175,
			variant: 'klatt'
		};
		
		if ( player_description['voice1'] )
		{
			_voice.variant = 'klatt';
			_voice.pitch = 0;
		}
		if ( player_description['voice2'] )
		{
			_voice.variant = 'klatt';
			_voice.pitch = 25;
		}
		if ( player_description['voice3'] )
		{
			_voice.variant = 'klatt';
			_voice.pitch = 50;
		}
		if ( player_description['voice4'] )
		{
			_voice.variant = 'f1';
			_voice.pitch = 75;
		}
		if ( player_description['voice5'] )
		{
			_voice.variant = 'f1';
			_voice.pitch = 100;
		}
		
		return _voice;
	}
	static CreateImageFromFile( filename )
	{
		if ( sdWorld.is_server )
		return null;
	
		let img = new Image();
		img.src = './assets/' + filename + '.png';
		
		img.loaded = false;
		img.onload = ()=>{ img.loaded = true; };
		
		return img;
	}
	static Start( player_settings )
	{
		if ( !globalThis.connection_established )
		{
			alert('Connection is not open yet, for some reason...');
		}
		else
		{
			let socket = globalThis.socket;
			
			globalThis.enable_debug_info = player_settings['bugs2'];

			socket.emit( 'RESPAWN', player_settings );

			sdRenderer.canvas.style.display = 'block';
			globalThis.settings_container.style.display = 'none';

			if ( globalThis.preview_interval !== null )
			{
				clearInterval( globalThis.preview_interval );
				globalThis.preview_interval = null;
			}

			globalThis.meSpeak.stop();
		}
	}
	static Stop()
	{
		sdRenderer.canvas.style.display = 'none';
		globalThis.settings_container.style.display = 'block';
		
		if ( globalThis.preview_interval === null )
		{
			globalThis.preview_interval = setInterval( globalThis.preview_fnc, 16 );
		}
		
		globalThis.meSpeak.stop();
		globalThis.socket.emit( 'SELF_EXTRACT' );
	}
	static GetAny( arr )
	{
		let r = Math.random() * arr.length;
		return arr[ ~~r ];
	}
}
//sdWorld.init_class();

export default sdWorld;