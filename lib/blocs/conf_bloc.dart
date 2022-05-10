import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/account.dart';
import '../models/conf.dart';
import '../utils/firestore_deligate.dart';

abstract class ConfEvent {}

class ConfListenStart extends ConfEvent {}

class _ConfOnSnapshot extends ConfEvent {
  final DocumentSnapshot<Map<String, dynamic>> snap;

  _ConfOnSnapshot(this.snap);
}

class _ConfOnError extends ConfEvent {}

class ConfSubscribed extends ConfEvent {
  final Account me;

  ConfSubscribed(this.me);
}

class ConfUnsubscribed extends ConfEvent {}

class ConfBloc extends Bloc<ConfEvent, Conf?> {
  final FireStorereDeligate _firestore;
  late DocumentReference<Map<String, dynamic>> _ref;

  ConfBloc({
    FirebaseFirestore? db,
  })  : _firestore = FireStorereDeligate(db ?? FirebaseFirestore.instance),
        super(null) {
    _ref = _firestore.db.collection('service').doc('conf');

    on<ConfListenStart>((event, emit) {
      _firestore.listen(
        _ref.snapshots().listen(
          (DocumentSnapshot<Map<String, dynamic>> snap) {
            add(_ConfOnSnapshot(snap));
          },
          onError: (Object error, StackTrace stackTrace) {
            debugPrint('$runtimeType:onError\n$error\n$stackTrace');
            add(_ConfOnError());
          },
        ),
      );
    });

    on<_ConfOnSnapshot>(
      (event, emit) => emit(event.snap.exists ? Conf(event.snap) : null),
    );

    on<_ConfOnError>((event, emit) => emit(null));

    on<ConfSubscribed>((event, emit) => _firestore.subscribe(event.me));

    on<ConfUnsubscribed>((event, emit) => _firestore.unsubscribe());
  }

  Future<void> update(Map<String, dynamic> data) =>
      _firestore.updateDocument(_ref, data);
}
