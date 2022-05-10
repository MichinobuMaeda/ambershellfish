import 'package:firebase_auth/firebase_auth.dart';
import 'package:equatable/equatable.dart';

class AuthUser extends Equatable {
  final String uid;
  final String? displayName;
  final String? email;
  final bool emailVerified;

  AuthUser(User user)
      : uid = user.uid,
        displayName = user.displayName,
        email = user.email,
        emailVerified = user.emailVerified;

  @override
  List<Object?> get props => [
        uid,
        displayName,
        email,
        emailVerified,
      ];
}
