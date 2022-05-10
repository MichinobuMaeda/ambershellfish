import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';
import '../utils/firestore_deligate.dart';

abstract class AccountsEvent {}

class AccountsSubscribed extends AccountsEvent {
  final Account me;

  AccountsSubscribed(this.me);
}

class AccountsUnsubscribed extends AccountsEvent {}

class _AccountsOnSnapshot extends AccountsEvent {
  final List<DocumentSnapshot<Map<String, dynamic>>> docs;

  _AccountsOnSnapshot(this.docs);
}

class _AccountsOnError extends AccountsEvent {}

class AccountsBloc extends Bloc<AccountsEvent, List<Account>> {
  final FireStorereDeligate _firestore;
  late CollectionReference<Map<String, dynamic>> _ref;
  Account? _me;

  AccountsBloc({
    FirebaseFirestore? db,
  })  : _firestore = FireStorereDeligate(db ?? FirebaseFirestore.instance),
        super([]) {
    _ref = _firestore.db.collection('accounts');

    on<AccountsSubscribed>((event, emit) {
      _me = event.me;
      _firestore.subscribe(_me!);
      _firestore.listen(
        _me!.admin
            ? _ref.snapshots().listen(
                (querySnap) {
                  add(_AccountsOnSnapshot(querySnap.docs));
                },
                onError: (Object error, StackTrace stackTrace) {
                  debugPrint('$runtimeType:onError\n$error\n$stackTrace');
                  add(_AccountsOnError());
                },
              )
            : _ref.doc(event.me.id).snapshots().listen(
                (snap) {
                  add(_AccountsOnSnapshot(snap.exists ? [snap] : []));
                },
                onError: (Object error, StackTrace stackTrace) {
                  debugPrint('$runtimeType:onError\n$error\n$stackTrace');
                  add(_AccountsOnError());
                },
              ),
      );
    });

    on<_AccountsOnSnapshot>(
      (event, emit) => emit(event.docs.map((snap) => Account(snap)).toList()),
    );

    on<_AccountsOnError>((event, emit) => emit([]));

    on<AccountsUnsubscribed>((event, emit) async {
      _me = null;
      await _firestore.unsubscribe();
      await _firestore.cancel();
      emit([]);
    });
  }

  Future<void> updateMyAccount(Map<String, dynamic> data) =>
      _firestore.updateDocument(_ref.doc(_me?.id), data);

  Future<void> update(String id, Map<String, dynamic> data) =>
      _firestore.updateDocument(_ref.doc(id), data);

  Future<void> delete(String id) => _firestore.deleteDocument(_ref.doc(id));

  Future<void> restore(String id) => _firestore.restoreDocument(_ref.doc(id));
}
