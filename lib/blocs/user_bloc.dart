// import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';
import '../models/auth_user.dart';
import '../models/account.dart';
import '../models/conf.dart';

class UserState extends Equatable {
  final bool confReceived;
  final bool authStateChecked;
  final AuthUser? authUser;
  final Account? me;

  const UserState({
    required this.confReceived,
    required this.authStateChecked,
    required this.authUser,
    required this.me,
  });

  UserState setConfReceived(bool confReceived) => UserState(
        confReceived: confReceived,
        authStateChecked: authStateChecked,
        authUser: authUser,
        me: me,
      );

  UserState setAuthStateChecked(bool authStateChecked) => UserState(
        confReceived: confReceived,
        authStateChecked: authStateChecked,
        authUser: authUser,
        me: me,
      );

  UserState copyWith({
    bool? confReceived,
    bool? authStateChecked,
    AuthUser? authUser,
    Account? me,
  }) =>
      UserState(
        confReceived: confReceived ?? this.confReceived,
        authStateChecked: authStateChecked ?? this.authStateChecked,
        authUser: authUser,
        me: me,
      );

  @override
  List<Object?> get props => [
        confReceived,
        authStateChecked,
        authUser,
        me,
      ];
}

abstract class UserEvent {}

class OnConfUpdated extends UserEvent {
  final Conf? conf;

  OnConfUpdated(this.conf);
}

class OnAuthStateChecked extends UserEvent {
  OnAuthStateChecked();
}

class OnAuthUserUpdated extends UserEvent {
  final AuthUser? authUser;

  OnAuthUserUpdated(this.authUser);
}

class OnAccountsUpdated extends UserEvent {
  final List<Account> accounts;

  OnAccountsUpdated(this.accounts);
}

class OnSingOutRequired extends UserEvent {}

class UserBloc extends Bloc<UserEvent, UserState> {
  final FirebaseFirestore _db;

  UserBloc({
    FirebaseFirestore? db,
  })  : _db = db ?? FirebaseFirestore.instance,
        super(const UserState(
          confReceived: false,
          authStateChecked: false,
          authUser: null,
          me: null,
        )) {
    on<OnConfUpdated>(
      (event, emit) => emit(state.setConfReceived(event.conf != null)),
    );

    on<OnAuthStateChecked>(
      (event, emit) => emit(state.setAuthStateChecked(true)),
    );

    on<OnAuthUserUpdated>((event, emit) async {
      validateAndEmitState(
        event.authUser,
        event.authUser == null
            ? null
            : event.authUser!.uid == state.me?.id
                ? state.me
                : await restoreMe(_db, event.authUser!.uid),
        emit,
      );
    });

    on<OnAccountsUpdated>((event, emit) {
      try {
        validateAndEmitState(
          state.authUser,
          state.authUser == null
              ? null
              : event.accounts.singleWhere(
                  (account) => account.id == state.authUser?.uid,
                ),
          emit,
        );
      } catch (e) {
        emit(state.copyWith(authUser: null, me: null));
      }
    });

    on<OnSingOutRequired>((event, emit) async {
      emit(state.copyWith(authUser: null, me: null));
    });
  }

  void validateAndEmitState(
    AuthUser? authUser,
    Account? me,
    Emitter emit,
  ) {
    if (validateState(authUser, me)) {
      emit(state.copyWith(authUser: authUser, me: me));
    } else {
      emit(state.copyWith(authUser: null, me: null));
    }
  }

  bool validateState(
    AuthUser? authUser,
    Account? me,
  ) =>
      (authUser == null && me == null) ||
      (authUser?.uid == me?.id &&
          (me?.valid ?? false) &&
          me?.deletedAt == null &&
          (state.me == null ||
              (state.me?.admin == me?.admin &&
                  state.me?.tester == me?.tester)));

  Future<Account?> restoreMe(
    FirebaseFirestore db,
    String uid,
  ) async {
    final snap = await db.collection('accounts').doc(uid).get();
    return snap.exists ? Account(snap) : null;
  }
}
