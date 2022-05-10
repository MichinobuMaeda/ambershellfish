import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/auth_user.dart';
import 'platform_bloc.dart';
import 'user_bloc.dart';

abstract class AuthEvent {}

class AuthListenStart extends AuthEvent {
  final BuildContext context;

  AuthListenStart(this.context);
}

class _AuthUserChanged extends AuthEvent {
  final User? user;

  _AuthUserChanged(this.user);
}

class AuthUserReloaded extends AuthEvent {}

class AuthUrlChanged extends AuthEvent {
  final String? url;

  AuthUrlChanged(this.url);
}

class AuthBloc extends Bloc<AuthEvent, AuthUser?> {
  static const String reauthenticateParam = '?reauthenticate=yes';

  final FirebaseAuth _auth;
  late PlatformBloc _platformBloc;
  String? _url;

  AuthBloc({
    FirebaseAuth? auth,
  })  : _auth = auth ?? FirebaseAuth.instance,
        super(null) {
    on<AuthListenStart>((event, emit) async {
      _platformBloc = event.context.read<PlatformBloc>();

      // Handle deeplink
      if (_auth.isSignInWithEmailLink(_platformBloc.state.deepLink)) {
        final String? email = _platformBloc.state.email;
        if (email != null) {
          await _auth.signInWithEmailLink(
            email: email,
            emailLink: _platformBloc.state.deepLink,
          );
          _platformBloc.add(SignedInAtChanged());
        }
      }

      // Listen auth status
      _auth.authStateChanges().listen((User? user) {
        event.context.read<UserBloc>().add(OnAuthStateChecked());
        add(_AuthUserChanged(user));
      });
    });

    on<_AuthUserChanged>((event, emit) =>
        emit(event.user == null ? null : AuthUser(event.user!)));

    on<AuthUserReloaded>((event, emit) async {
      await _auth.currentUser?.reload();
      emit(_auth.currentUser == null ? null : AuthUser(_auth.currentUser!));
    });

    on<AuthUrlChanged>((event, emit) {
      _url = event.url;
    });
  }

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
    _platformBloc.add(SignedInAtChanged());
  }

  Future<void> sendSignInLinkToEmail(String email) async {
    await _auth.sendSignInLinkToEmail(
      email: email,
      actionCodeSettings: ActionCodeSettings(
        url: _url!,
        handleCodeInApp: true,
      ),
    );
    _platformBloc.add(SignInEmailChanged(email));
  }

  Future<void> sendEmailVerification() =>
      _auth.currentUser!.sendEmailVerification();

  Future<void> reauthenticateWithEmail() async {
    final String email = _auth.currentUser!.email!;
    await _auth.sendSignInLinkToEmail(
      email: _auth.currentUser!.email!,
      actionCodeSettings: ActionCodeSettings(
        url: '$_url$reauthenticateParam',
        handleCodeInApp: true,
      ),
    );
    _platformBloc.add(SignInEmailChanged(email));
  }

  Future<void> reauthenticateWithPassword(String password) async {
    await _auth.currentUser!.reauthenticateWithCredential(
      EmailAuthProvider.credential(
        email: _auth.currentUser!.email!,
        password: password,
      ),
    );
    _platformBloc.add(SignedInAtChanged());
  }

  Future<void> updateMyEmail(String email) =>
      _auth.currentUser!.updateEmail(email);

  Future<void> updateMyPassword(String password) =>
      _auth.currentUser!.updatePassword(password);

  Future<void> signOut() async {
    if (_auth.currentUser != null) {
      await _auth.signOut();
    }
  }
}
